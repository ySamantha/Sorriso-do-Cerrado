import subprocess
import time
import json
import urllib.request
import urllib.error

API_URL = "http://localhost:3000"

def esperar_api(max_tentativas=20):
    for _ in range(max_tentativas):
        try:
            req = urllib.request.Request(f"{API_URL}/")
            with urllib.request.urlopen(req) as res:
                if res.status == 200:
                    return True
        except Exception:
            pass
        time.sleep(2)
    return False

def requisicao(endpoint, method="GET", body=None, token=None):
    url = f"{API_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as res:
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

def rodar_fluxo_completo():
    print("🚀 Subindo containers do Docker...")
    subprocess.run(["docker", "compose", "up", "-d"], check=True)

    print("⏳ Aguardando a API e o banco de dados ficarem prontos...")
    if not esperar_api():
        print("❌ A API não respondeu a tempo.")
        subprocess.run(["docker", "compose", "down"])
        return

    time.sleep(2)

    print("\n=======================================================")
    print("🧪 EXECUTANDO FLUXO COMPLETO E2E (LOJA + PERFIL DO USUÁRIO)")
    print("=======================================================\n")

    try:
        # --- ETAPA 1: SETUP ADMIN E PRODUTO ---
        print("👤 [ADMIN] 1. Autenticando Administrador...")
        status, res = requisicao("/usuarios/login", method="POST", body={
            "email": "admin@email.com",
            "senha": "admin123"
        })
        assert status == 200 and "token" in res, f"Erro no login do admin: {res}"
        token_admin = res["token"]
        print("   ✔ Admin autenticado com sucesso!")

        print("\n📦 [ADMIN] 2. Cadastrando produto artesanal...")
        status, res_prod = requisicao("/produtos", method="POST", body={
            "nome": "Escultura em Madeira Ipê",
            "descricao": "Escultura artesanal entalhada à mão.",
            "preco": 149.90,
            "estoque": 5,
            "imagemURL": "http://localhost:3000/uploads/ipe.jpg"
        }, token=token_admin)
        assert status == 201, f"Erro ao criar produto: {res_prod}"
        id_produto = res_prod["id"]
        print(f"   ✔ Produto criado com ID: {id_produto}")

        # --- ETAPA 2: CADASTRO E LOGIN DE CLIENTE ---
        ts = int(time.time())
        email_original = f"usuario_{ts}@email.com"
        senha_original = "senha123"

        print(f"\n📝 [USUÁRIO] 3. Cadastrando novo usuário ({email_original})...")
        status, res = requisicao("/usuarios", method="POST", body={
            "nome": "Vinicios Costa",
            "email": email_original,
            "senha": senha_original,
            "papel": "cliente"
        })
        assert status == 201, f"Erro no cadastro: {res}"
        print("   ✔ Usuário cadastrado com sucesso!")

        print("\n🔑 [USUÁRIO] 4. Efetuando primeiro login...")
        status, res = requisicao("/usuarios/login", method="POST", body={
            "email": email_original,
            "senha": senha_original
        })
        assert status == 200 and "token" in res, f"Erro no login: {res}"
        token_user = res["token"]
        id_user = res["id"]
        print("   ✔ Login realizado!")

        # --- ETAPA 3: AÇÕES DE PERFIL E CONTA ---
        email_atualizado = f"vinicios_novo_{ts}@email.com"
        print(f"\n✏️ [USUÁRIO] 5. Atualizando dados de perfil (Nome e E-mail para {email_atualizado})...")
        status, res = requisicao("/usuarios/me", method="PUT", body={
            "nome": "Vinicios Trindade Costa",
            "email": email_atualizado
        }, token=token_user)
        assert status == 200, f"Erro ao atualizar dados: {res}"
        print("   ✔ Dados atualizados com sucesso!")

        # --- ETAPA 4: COMPRA E FAVORITOS ---
        print("\n❤️ [USUÁRIO] 6. Adicionando item aos favoritos...")
        status, res = requisicao("/favoritos", method="POST", body={"id_produto": id_produto}, token=token_user)
        assert status == 201, f"Erro ao favoritar: {res}"
        print("   ✔ Item favoritado!")

        print("\n💔 [USUÁRIO] 7. Removendo item dos favoritos...")
        status, res = requisicao(f"/favoritos/{id_produto}", method="DELETE", token=token_user)
        assert status == 200, f"Erro ao remover favorito: {res}"
        print("   ✔ Item removido dos favoritos!")

        print("\n🛒 [USUÁRIO] 8. Realizando checkout (Criando venda)...")
        status, res_venda = requisicao("/vendas", method="POST", body={
            "nomeCliente": "Vinicios Trindade Costa",
            "emailCliente": email_atualizado,
            "telefoneCliente": "61988887777",
            "total": 149.90
        }, token=token_user)
        assert status == 201, f"Erro ao finalizar venda: {res_venda}"
        print(f"   ✔ Venda realizada com sucesso! Pedido nº #{res_venda['id']}")

        # --- ETAPA 5: AUDITORIA E EXCLUSÃO PELO ADMIN ---
        print("\n👥 [ADMIN] 9. Listando todos os usuários no painel...")
        status, lista_users = requisicao("/usuarios", token=token_admin)
        assert status == 200 and any(u["id"] == id_user for u in lista_users), "Usuário não listado no admin"
        print(f"   ✔ Usuário #{id_user} localizado na lista de {len(lista_users)} usuários!")

        print(f"\n🗑️ [ADMIN] 10. Deletando a conta de teste (ID #{id_user})...")
        status, res = requisicao(f"/usuarios/{id_user}", method="DELETE", token=token_admin)
        assert status == 200, f"Erro ao deletar usuário: {res}"
        print("   ✔ Usuário deletado pelo Admin com sucesso!")

        print("\n=======================================================")
        print("🎉 TODOS OS TESTES DO FLUXO DO USUÁRIO PASSARAM COM SUCESSO!")
        print("=======================================================\n")

    except AssertionError as err:
        print(f"\n❌ [FALHA NO FLUXO]: {err}\n")
    except Exception as err:
        print(f"\n❌ [ERRO INESPERADO]: {err}\n")
    finally:
        print("🧹 Encerrando os containers Docker...")
        subprocess.run(["docker", "compose", "down"])
        print("✨ Limpeza concluída!")

if __name__ == "__main__":
    rodar_fluxo_completo()