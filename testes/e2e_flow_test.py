import os
import subprocess
import time
import json
import urllib.request
import urllib.error
import http.cookiejar

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPOSE_FILE = os.path.join(BASE_DIR, "docker-compose.yml")

API_URL = "http://localhost:3000"

cookie_jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))

def esperar_api(max_tentativas=20):
    for _ in range(max_tentativas):
        try:
            req = urllib.request.Request(f"{API_URL}/")
            with opener.open(req) as res:
                if res.status == 200:
                    return True
        except Exception:
            pass
        time.sleep(2)
    return False

def requisicao(endpoint, method="GET", body=None):
    url = f"{API_URL}{endpoint}"
    headers = {
        "Origin": "http://localhost:5173",
    }
    data = json.dumps(body).encode("utf-8") if body is not None else None
    if data is not None:
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with opener.open(req) as res:
            res_body = res.read().decode("utf-8")
            try:
                return res.status, json.loads(res_body) if res_body else {}
            except json.JSONDecodeError:
                return res.status, res_body
    except urllib.error.HTTPError as e:
        res_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(res_body) if res_body else {}
        except json.JSONDecodeError:
            return e.code, res_body

def rodar_teste_completo_better_auth():
    print("🚀 Subindo containers do Docker...")
    subprocess.run(["docker", "compose", "-f", COMPOSE_FILE, "up", "-d"], check=True)

    print("⏳ Aguardando a API e o banco de dados ficarem prontos...")
    if not esperar_api():
        print("❌ A API não respondeu a tempo.")
        subprocess.run([
            "docker", "compose", "-f", COMPOSE_FILE,
            "logs", "--no-color", "backend", "mysql"
        ])
        subprocess.run(["docker", "compose", "-f", COMPOSE_FILE, "down"])
        return

    time.sleep(2)

    print("\n=======================================================")
    print("🧪 EXECUTANDO BATERIA DE TESTES TOTAL DO BETTER AUTH")
    print("=======================================================\n")

    try:
        # -------------------------------------------------------------
        # TESTE 1: AUTENTICAÇÃO DO ADMIN PADRÃO (SEED)
        # -------------------------------------------------------------
        print("👤 1. [Better Auth] Login com conta Administradora criada no Seed...")
        status, res = requisicao("/api/auth/sign-in/email", method="POST", body={
            "email": "admin@email.com",
            "password": "admin123"
        })
        assert status == 200, f"Erro no login do admin: {res}"
        print("   ✔ Admin logado e cookie de sessão gerado!")

        print("\n🔒 2. [Proteção] Cadastrando produto com credenciais de Admin...")
        status, res_prod = requisicao("/produtos", method="POST", body={
            "nome": "Vaso de Cerâmica Artesanal",
            "descricao": "Vaso feito à mão no cerrado.",
            "preco": 89.90,
            "estoque": 10,
            "imagemURL": "http://localhost:3000/uploads/vaso.jpg"
        })
        assert status == 201, f"Erro ao criar produto: {res_prod}"
        id_produto = res_prod["id"]
        print(f"   ✔ Produto criado com ID #{id_produto}")

        status, legacy_res = requisicao("/usuarios", method="POST", body={
            "nome": "Admin Inválido",
            "email": f"legacy_{int(time.time())}@email.com",
            "senha": "senhaForte123",
            "papel": "admin"
        })
        assert status == 410, f"Endpoint legado de cadastro deveria estar desativado: {legacy_res}"

        # -------------------------------------------------------------
        # TESTE 2: REGISTRO DE NOVO CLIENTE VIA BETTER AUTH
        # -------------------------------------------------------------
        cookie_jar.clear() # Limpa sessão do Admin
        ts = int(time.time())
        email_cliente = f"cliente_{ts}@email.com"
        senha_cliente = "senhaForte123"

        print(f"\n📝 3. [Better Auth] Criando novo usuário via sign-up ({email_cliente})...")
        status, res = requisicao("/api/auth/sign-up/email", method="POST", body={
            "name": "Cliente Teste BetterAuth",
            "email": email_cliente,
            "password": senha_cliente,
            "papel": "admin"
        })
        assert status == 200, f"Erro ao registrar cliente: {res}"
        print("   ✔ Registro via Better Auth concluído!")

        # -------------------------------------------------------------
        # TESTE 3: SESSÃO ATIVA E DADOS DE USUÁRIO
        # -------------------------------------------------------------
        print("\n🕵️ 4. [Better Auth] Validando sessão ativa via get-session...")
        status, session_info = requisicao("/api/auth/get-session")
        assert status == 200 and session_info.get("user"), f"Sessão inválida: {session_info}"
        assert session_info["user"].get("papel") == "cliente", (
            "Cadastro público não deve aceitar papel de administrador"
        )
        user_id = session_info["user"]["id"]
        print(f"   ✔ Sessão confirmada para User ID: {user_id}")

        # -------------------------------------------------------------
        # TESTE 4: ATUALIZAÇÃO DE PERFIL (UPDATE USER)
        # -------------------------------------------------------------
        novo_nome = "Cliente Teste Alterado"
        print(f"\n✏️ 5. [Better Auth] Atualizando nome do perfil para '{novo_nome}'...")
        status, res = requisicao("/api/auth/update-user", method="POST", body={
            "name": novo_nome
        })
        assert status == 200, f"Erro ao atualizar perfil: {res}"

        # Confirma se atualizou na sessão
        status, session_info = requisicao("/api/auth/get-session")
        assert session_info["user"]["name"] == novo_nome, "Nome não foi atualizado no perfil!"
        print("   ✔ Nome do usuário atualizado com sucesso!")

        email_original = session_info["user"]["email"]
        status, res = requisicao("/api/auth/change-email", method="POST", body={
            "newEmail": "admin@email.com",
            "callbackURL": "http://localhost:5173/editar-dados",
        })
        assert status == 200, f"Erro inesperado ao testar e-mail já cadastrado: {res}"
        status, session_info = requisicao("/api/auth/get-session")
        assert status == 200 and session_info["user"]["email"] == email_original, (
            "A tentativa de usar um e-mail existente não deveria alterar a conta"
        )
        print("   ✔ E-mail já cadastrado não alterou a conta nem revelou sua existência!")

        novo_email_cliente = f"cliente_atualizado_{ts}@email.com"
        status, res = requisicao("/api/auth/change-email", method="POST", body={
            "newEmail": novo_email_cliente,
            "callbackURL": "http://localhost:5173/editar-dados",
        })
        assert status == 200, f"Erro ao atualizar e-mail: {res}"
        status, session_info = requisicao("/api/auth/get-session")
        assert status == 200 and session_info["user"]["email"] == novo_email_cliente, (
            f"O e-mail não foi atualizado: {session_info}"
        )
        email_cliente = novo_email_cliente
        print("   ✔ E-mail único atualizado com Better Auth!")

        # -------------------------------------------------------------
        # TESTE 5: ALTERAÇÃO DE SENHA (CHANGE PASSWORD)
        # -------------------------------------------------------------
        nova_senha_cliente = "novaSenhaSegura456"
        print("\n🔑 6. [Better Auth] Alterando a senha da conta...")
        status, res = requisicao("/api/auth/change-password", method="POST", body={
            "currentPassword": senha_cliente,
            "newPassword": nova_senha_cliente,
            "revokeOtherSessions": True
        })
        assert status == 200, f"Erro ao alterar senha: {res}"
        print("   ✔ Senha alterada com sucesso!")

        # -------------------------------------------------------------
        # TESTE 6: RE-AUTENTICAÇÃO E REGRAS DE NEGÓCIO DA LOJA
        # -------------------------------------------------------------
        print("\n🚪 7. [Better Auth] Fazendo logout...")
        status, res = requisicao("/api/auth/sign-out", method="POST")
        assert status == 200, f"Erro ao fazer logout (HTTP {status}): {res}"
        cookie_jar.clear()

        print("\n🔐 8. [Better Auth] Testando login com a nova senha...")
        status, res = requisicao("/api/auth/sign-in/email", method="POST", body={
            "email": email_cliente,
            "password": nova_senha_cliente
        })
        assert status == 200, "Falha no login com a nova senha!"
        print("   ✔ Login realizado com sucesso usando a nova senha!")

        print("\n❤️ 9. [Rotas Protegidas] Adicionando produto aos Favoritos...")
        status, res = requisicao("/favoritos", method="POST", body={"id_produto": id_produto})
        assert status == 201, f"Erro ao favoritar: {res}"
        print("   ✔ Favorito adicionado com autenticação do Better Auth!")

        print("\n🛒 10. [Rotas Protegidas] Finalizando uma compra (Venda)...")
        status, res_venda = requisicao("/vendas", method="POST", body={
            "nomeCliente": novo_nome,
            "emailCliente": email_cliente,
            "telefoneCliente": "61999998888",
            "total": 89.90
        })
        assert status == 201, f"Erro ao registrar venda: {res_venda}"
        print(f"   ✔ Venda #{res_venda['id']} realizada com sucesso!")

        # -------------------------------------------------------------
        # TESTE 7: TENTATIVA DE ACESSO NEGADO (CONTROLE DE ACESSO DE ROLES)
        # -------------------------------------------------------------
        print("\n🚫 11. [Autorização] Tentando deletar o produto como Cliente (Deve dar 403/Acesso Negado)...")
        status, res = requisicao(f"/produtos/{id_produto}", method="DELETE")
        assert status == 403, f"Acesso deveria ter sido negado, mas retornou status {status}"
        print("   ✔ Permissões validadas! Cliente impedido de realizar ações de admin.")

        # -------------------------------------------------------------
        # TESTE 8: LIMPEZA DE DADOS COMO ADMIN
        # -------------------------------------------------------------
        cookie_jar.clear()
        print("\n👑 12. [Admin] Logando como Admin para excluir a conta de teste...")
        requisicao("/api/auth/sign-in/email", method="POST", body={
            "email": "admin@email.com",
            "password": "admin123"
        })

        status, res = requisicao(f"/usuarios/{user_id}", method="DELETE")
        assert status == 200, f"Erro ao deletar usuário no admin: {res}"
        print(f"   ✔ Conta de teste #{user_id} excluída do banco pelo Admin!")

        print("\n=======================================================")
        print("🎉 TODOS OS TESTES DO BETTER AUTH E ROTAS PASSARAM 100%!")
        print("=======================================================\n")

    except AssertionError as err:
        print(f"\n❌ [FALHA NO TESTE]: {err}\n")
    except Exception as err:
        print(f"\n❌ [ERRO INESPERADO]: {err}\n")
    finally:
        print("🧹 Encerrando os containers Docker...")
        subprocess.run(["docker", "compose", "-f", COMPOSE_FILE, "down"])
        print("✨ Limpeza concluída!")

if __name__ == "__main__":
    rodar_teste_completo_better_auth()