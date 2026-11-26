# Documentação Técnica do Modelo de Dados (`DADOS.pdf`)

**Arquivo Oficial Obrigatório:** [`DADOS.pdf`](../DADOS.pdf)  
**Camada de Persistência:** MySQL 8 + `mysql2/promise` + Drizzle ORM + Better Auth  
**Escopo:** Especificação lógica, física, relacional, chaves primárias/estrangeiras, criptografia em repouso e regras de integridade mapeadas diretamente do código-fonte.

[:material-file-pdf-box: Baixar Documentação Completa do Modelo de Dados (`DADOS.pdf` — 17 págs.)](../DADOS.pdf){ .md-button .md-button--primary }

---

## 1. Visão Geral da Persistência

O modelo de dados do **Sorriso do Cerrado** segue o paradigma relacional em **MySQL 8**, gerenciado via **Drizzle ORM** e versionado por migrações SQL geradas pelo **Drizzle Kit** (`0000` a `0011`). A autenticação via **Better Auth** compartilha o mesmo banco relacional por meio do `drizzleAdapter`.

Os dados organizam-se em **quatro domínios funcionais interdependentes**:

1. **Autenticação e Controle de Acesso:** contas de usuários, papéis (`cliente`, `artisan`/`artesa`, `admin`, `super_admin`), sessões ativas, provedores e tokens temporários de verificação.
2. **Lojas e Artesãos:** perfis públicos de loja, cadastro profissional, subconta AbacatePay e dados sensíveis cifrados em repouso (**AES-256-GCM**).
3. **Catálogo e Interação Comercial:** produtos artesanais, favoritos persistidos e mensageria direta entre clientes e artesãos.
4. **Financeiro, Pedidos e Auditoria Administrativa:** vendas/pedidos com split Pix, itens de venda com valor de repasse, saques de artesãos, eventos idempotentes de webhook, banners promocionais e trilha de auditoria administrativa.

---

## 2. Inventário das Tabelas (Visão Lógica e Física)

### 2.1 Tabelas Mapeadas no `DADOS.pdf` (14 Entidades Lógicas)

| Tabela (`DADOS.pdf`) | Domínio | Finalidade Principal |
| :--- | :--- | :--- |
| `user` | Autenticação e Acesso | Contas de usuários, credenciais básicas, papel (`role`/`papel`) e ativação (`is_active`). |
| `session` | Autenticação e Acesso | Sessões autenticadas ativas, tokens únicos, expiração, IP e *user agent*. |
| `account` | Autenticação e Acesso | Vínculo de provedores (`credential`/OAuth) e hashes criptográficos de senha. |
| `verification` | Autenticação e Acesso | Tokens temporários de verificação de e-mail e recuperação. |
| `artisans` | Lojas e Artesãos | Perfil comercial público da loja + dados pessoais/fiscais/bancários cifrados com AES-256-GCM. |
| `products` | Catálogo e Comercial | Peças artesanais ofertadas, categoria, preço, estoque, imagens e disponibilidade. |
| `cart_items` | Catálogo e Comercial | Associação de itens selecionados no carrinho de compras com quantidade. |
| `favorites` | Catálogo e Comercial | Lista de desejos (relação N:M entre usuários e produtos). |
| `messages` | Catálogo e Comercial | Mensagens trocadas entre usuários e artesãos, com controle de leitura. |
| `orders` | Financeiro e Pedidos | Pedidos de compra, valor bruto, taxa da plataforma, repasse líquido, status e dados Pix AbacatePay. |
| `order_items` | Financeiro e Pedidos | Itens detalhados de cada pedido com quantidade e preço congelado no ato da compra. |
| `withdrawals` | Financeiro e Pedidos | Solicitações de saque financeiro dos artesãos e IDs externos na AbacatePay. |
| `banners` | Gestão Administrativa | Banners promocionais exibidos na vitrine principal com ordenação e visibilidade. |
| `admin_logs` | Auditoria Administrativa | Trilha imutável de auditoria das ações executadas por administradores. |

!!! note "Alinhamento com o Esquema Físico do Repositório (`Back-End/src/database/schema.ts` — Migração 0011)"
    No código-fonte em português (detalhado na Seção 8 do Documento de Arquitetura v2.0), essas mesmas entidades materializam-se em **16 tabelas físicas**: `user`, `session`, `account`, `verification`, `artesao_perfis`, `artesao_cadastros`, `produtos`, `favoritos`, `banners`, `vendas`, `itens_venda`, `saques_artesao`, `eventos_abacatepay`, `conversas`, `mensagens` e `admin_audit_logs`.

---

## 3. Principais Relacionamentos e Cardinalidades

* **Usuário — Sessão (`1:N`):** um usuário pode manter múltiplas sessões simultâneas (`ON DELETE CASCADE`).
* **Usuário — Conta de Autenticação (`1:N`):** vínculo com provedores locais ou externos (`ON DELETE CASCADE`).
* **Usuário — Artesão / Perfil de Loja (`1:1`):** garantido por restrição `UNIQUE` sobre `user_id` (`id_usuario`).
* **Artesão — Produto (`1:N`):** cada produto pertence a um único artesão responsável.
* **Usuário — Favorito (`1:N`) e Produto — Favorito (`1:N`):** materializa a relação N:M de lista de desejos.
* **Usuário — Conversa / Mensagem (`1:N` duplo):** identifica remetente e destinatário, com restrição única `(cliente_id, artesao_id)` para garantir uma conversa única por par de usuários.
* **Pedido (`orders`/`vendas`) — Item de Pedido (`order_items`/`itens_venda`) (`1:N`):** cada venda possui um ou mais itens, registrando preço unitário e `valor_repasse` por artesão.
* **Artesão — Saque (`1:N`):** histórico de solicitações de transferência na AbacatePay.
* **Administrador — Log Administrativo (`1:N`):** rastreabilidade completa de criações, edições e desativações.
* **Entidades Independentes:** `banners`, `verification` e `eventos_abacatepay` (idempotência de webhooks pela chave primária do evento).

---

## 4. Regras de Integridade e Segurança de Dados

1. **Unicidade de Identificadores (`UNIQUE`):** e-mail do usuário, token de sessão, vínculo 1:1 do artesão, `subconta_id`, par `(cliente_id, artesao_id)` e ID de evento webhook.
2. **Exclusão em Cascata (`ON DELETE CASCADE`):** aplicada em tabelas dependentes diretas (`session`, `account`, favoritos, itens de venda), evitando registros órfãos.
3. **Exclusão Lógica (*Soft Delete*):** contas de usuários são desativadas via `is_active = false` e `deleted_at`, encerrando imediatamente todas as sessões sem apagar o histórico de vendas e auditoria.
4. **Criptografia em Repouso (AES-256-GCM):** documentos fiscais (CPF/CNPJ), telefone, endereço, chave Pix e dados bancários são cifrados na camada de aplicação com vetor de inicialização aleatório e tag de autenticação antes da persistência.
5. **Precisão Monetária:** valores enviados à API AbacatePay são convertidos para centavos (inteiros), preservando exatidão contábil no cálculo de comissão e repasse.

---

## 5. Visualização Completa do `DADOS.pdf` (incluindo o DER na Página 17)

<iframe src="../../DADOS.pdf" width="100%" height="700" style="border: 1px solid rgba(141, 91, 76, 0.35); border-radius: 8px; background: #fff;">
  Seu navegador não suporta visualização embutida de PDF. <a href="../../DADOS.pdf">Clique aqui para abrir ou baixar o DADOS.pdf</a>.
</iframe>
