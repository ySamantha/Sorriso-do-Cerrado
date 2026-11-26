# Especificação de Casos de Uso

**Fontes Oficiais:**
* **Documento de Requisitos de Software e Especificação de Casos de Uso (v3.0 — 20/10/2026):** detalhamento completo de `UC001` a `UC012`.
* **Documento de Arquitetura de Software (v2.0 — 24/11/2026):** visão expandida do marketplace com **19 casos de uso (`UC001` a `UC019`)** alinhada ao código-fonte.

[:material-file-pdf-box: Baixar Requisitos e Casos de Uso v3.0 (PDF)](../assets/v2/documentos/Documento_de_Requisitos_e_Casos_de_Uso_-_v3.0.pdf){ .md-button .md-button--primary }
[:material-file-pdf-box: Baixar Arquitetura v2.0 (PDF)](../assets/v2/documentos/Documento_de_Arquitetura_de_Software_-_v2.0.pdf){ .md-button }

---

## 1. Especificação Detalhada (Requisitos v3.0 — UC001 a UC012)

### UC001 — Fazer Login
* **Atores:** Artesão, Cliente e Administrador.
* **Descrição:** Permite acessar o sistema utilizando e-mail e senha, validando conta ativa, gerando sessão em cookie via Better Auth e direcionando o usuário conforme seu papel.
* **Pré-condições:** Usuário na tela inicial ou de login.
* **Fluxo Principal:**
    1. O ator informa e-mail e senha.
    2. O sistema verifica se a conta está ativa (`is_active = true`) e valida o hash da senha via Better Auth.
    3. Em caso de sucesso, cria sessão no banco (`session`), retorna o cookie HTTP, atualiza o `AuthContext` e redireciona o usuário para a rota correspondente ao seu perfil.
* **Fluxos Alternativos:** Em caso de erro de credenciais ou necessidade de ajuste, o ator pode corrigir os dados (ou solicitar alteração de senha quando autenticado no perfil).
* **Exceções:** Conta desativada retorna HTTP `403` (*"Esta conta está desativada"*); credenciais inválidas retornam HTTP `401`.
* **Pós-condições:** Usuário autenticado com sessão ativa e menu compatível com seu papel.

### UC002 — Cadastro de Usuário, Cliente e Artesão
* **Atores:** Visitante / Cliente, Artesão e Administrador.
* **Pré-condições:** Usuário acessa a tela de cadastro a partir da página inicial.
* **Fluxo Principal:**
    1. O ator preenche os dados solicitados (nome, e-mail, senha forte e confirmação).
    2. O sistema valida o formulário e verifica se o e-mail já existe no banco.
    3. Sendo novo, salva a conta com senha em hash e papel `cliente` (o cadastro profissional de artesão ocorre na sequência via fluxo *"Quero vender"*).
* **Fluxos Alternativos:** Conta já existente gera alerta específico.
* **Exceções:** Dados inválidos impedem o cadastro e retornam ao preenchimento.
* **Pós-condições:** Nova conta criada no banco de dados.

### UC003 — Visualizar Painel de Controle
* **Atores:** Artesão (`artisan`) e Administrador (`admin` / `super_admin`).
* **Pré-condições:** Usuário autenticado com permissão compatível (`/admin` ou `/painel-administrativo`).
* **Fluxo Principal:**
    1. O front-end (`RotaAdmin`) e os *preHandlers* do Fastify (`autenticar` e `autorizar`) validam sessão e papel.
    2. O sistema exibe o painel com as abas correspondentes: Resumo/AbacatePay, Produtos, Pedidos, Mensagens, Configurações e Saques (Artesão) ou Indicadores, Banners, Contas e Administradores (Admin/Super Admin).
* **Exceções:** Perfil não autorizado recebe notificação de acesso negado (`401`/`403`) e é redirecionado para a página inicial.
* **Pós-condições:** Painel exibido e operacional.

### UC004 — Navegar no Catálogo
* **Ator:** Cliente (acesso público).
* **Pré-condições:** Nenhuma.
* **Fluxo Principal:** O cliente acessa o catálogo; o sistema carrega a lista de produtos ativos; o cliente pode continuar navegando, filtrar resultados ou abrir a página de detalhes de uma peça ou loja de artesão.
* **Pós-condições:** Lista de produtos exibida ou página de detalhes aberta.

### UC005 — Pesquisar Produtos
* **Ator:** Cliente.
* **Pré-condições:** Usuário na página de catálogo (`/explorar` ou `/produtos`).
* **Fluxo Principal:** O cliente digita o termo de busca (nome do produto, categoria ou nome do artesão) e/ou escolhe filtros (categorias, faixa de preço e ordenação); o back-end valida o schema e retorna a lista filtrada.
* **Exceções:** Nenhum produto encontrado exibe mensagem *"Nenhum produto encontrado"*.
* **Pós-condições:** Lista filtrada ou aviso de ausência de resultados exibido.

### UC006 — Gerenciar Carrinho
* **Ator:** Cliente.
* **Pré-condições:** Pelo menos um produto adicionado ao carrinho.
* **Fluxo Principal:** O sistema exibe os itens do carrinho; o cliente altera quantidades ou exclui itens; o valor total é recalculado em tempo real; o cliente pode prosseguir para o pagamento.
* **Exceções:** Carrinho vazio exibe mensagem *"Carrinho Vazio"*.
* **Pós-condições:** Carrinho atualizado ou redirecionamento para finalização da compra.

### UC007 — Visualizar Detalhes do Produto
* **Ator:** Cliente.
* **Pré-condições:** Produto selecionado na vitrine, catálogo ou loja de um artesão.
* **Fluxo Principal:** O sistema exibe nome, descrição técnica, preço unitário, estoque disponível, imagem ampliada e acesso direto à loja pública do artesão; o cliente pode favoritar ou adicionar ao carrinho.
* **Pós-condições:** Detalhes completos exibidos com ações disponíveis.

### UC008 — Finalizar Compra (Checkout Pix — UC007 na Arquitetura v2.0)
* **Atores:** Cliente e AbacatePay (sistema externo).
* **Pré-condições:** Cliente autenticado com itens válidos no carrinho e artesãos com subconta habilitada.
* **Fluxo Principal:**
    1. O cliente clica em *"Finalizar compra"*.
    2. O back-end recalcula os preços a partir do banco, garante a subconta AbacatePay de cada artesão (`subcontaArtesaoService`) e calcula o repasse líquido descontando a comissão da plataforma.
    3. Cria a cobrança Pix transparente na AbacatePay (`POST /transparents/create`, validade de 15 min) com o array de `splits[]`.
    4. Registra a venda (`pendente`) e `itens_venda` (com `valor_repasse`) no MySQL e retorna o QR Code e código Pix copia-e-cola.
    5. O front-end consulta o status periodicamente (`GET /vendas/:id/pagamento` a cada 5s) enquanto a AbacatePay envia a confirmação assíncrona via webhook (`transparent.completed`), validada por `X-Webhook-Secret`, HMAC-SHA256 e idempotência (`eventos_abacatepay`), marcando a venda como `confirmada`.
* **Exceções:** Itens inválidos (`400`), loja sem subconta habilitada (`409`) ou cobrança expirada/cancelada.
* **Pós-condições:** Venda confirmada no banco com repasses registrados e carrinho limpo.

### UC009 — Favoritar Produto
* **Ator:** Cliente.
* **Pré-condições:** Usuário visualizando um produto no catálogo ou página de detalhes.
* **Fluxo Principal:** O cliente clica em *"Favoritar"*; o sistema verifica a autenticação e checa se o item já está favoritado, adicionando ou removendo o registro na tabela `favoritos`.
* **Fluxos Alternativos:** Usuário não logado é redirecionado para a tela de login.
* **Pós-condições:** Lista de favoritos atualizada no banco de dados.

### UC010 — Manter Catálogo
* **Ator:** Artesão (ou Administrador).
* **Pré-condições:** Usuário autenticado acessando a aba Produtos do painel.
* **Fluxo Principal:** O artesão seleciona um produto e escolhe *"Editar"* (valida dados e atualiza no MySQL) ou *"Excluir"* (solicita confirmação e remove do banco), respeitando o isolamento de propriedade (`id_usuario`).
* **Fluxos Alternativos:** Cancelamento retorna à listagem.
* **Exceções:** Tentativa de alterar produto de outro artesão retorna `403`; dados inválidos exibem mensagem de erro.
* **Pós-condições:** Catálogo atualizado no banco e refletido na vitrine.

### UC011 — Enviar Mensagem para a Loja (UC013 na Arquitetura v2.0)
* **Atores:** Cliente e Artesão.
* **Pré-condições:** Usuário autenticado.
* **Fluxo Principal:** O usuário acessa a página pública de uma loja e clica em *"Enviar mensagem para a loja"*; o sistema consulta a conversa única existente para o par `(cliente_id, artesao_id)` ou inicia nova conversa, redirecionando para a Central de Mensagens para digitação e envio.
* **Fluxos Alternativos:** Acesso direto pelo menu da conta para responder conversas existentes.
* **Exceções:** Usuário não autenticado redireciona para o login; envio para a própria loja é bloqueado; mensagem vazia ou acima de 5.000 caracteres é rejeitada.
* **Pós-condições:** Mensagem salva no banco e exibida no histórico da conversa.

### UC012 — Gerenciar Loja e Recebimentos do Artesão
* **Ator:** Artesão.
* **Pré-condições:** Usuário autenticado com perfil de artesão.
* **Fluxo Principal:** No painel, visualiza a aba **Resumo** (indicadores, gráfico de vendas e saldo AbacatePay), atualiza nome público, descrição, logo, capa, prazo de produção e envio em **Configurações da Loja**, e gerencia seus dados financeiros/chave Pix (cifrados em AES-256-GCM) em **Dados de Recebimento**.
* **Fluxos Alternativos:** Caso ainda não possua subconta vinculada, o painel exibe aviso orientando o cadastro financeiro.
* **Exceções:** Usuário sem perfil de artesão não acessa recursos financeiros; dados inválidos impedem o salvamento.
* **Pós-condições:** Loja e dados de recebimento atualizados.

---

## 2. Casos de Uso Expandidos do Marketplace (Arquitetura v2.0 — UC011 a UC019)

O **Documento de Arquitetura de Software (v2.0)** mapeia todos os **19 casos de uso** efetivamente implementados no código-fonte, incluindo os fluxos de onboarding, lojas públicas, saques e administração hierárquica:

| Código (Arq. v2.0) | Caso de Uso | Ator Principal | Endpoints / Mecanismos Principais |
| :---: | :--- | :--- | :--- |
| **UC011** | Cadastrar Perfil de Artesão (*"Quero vender"*) | Cliente → Artesão + AbacatePay | `POST /usuarios/artesao` — valida CPF/CNPJ, CEP e Pix, cifra com AES-256-GCM, promove papel para `artisan` e cria subconta AbacatePay. |
| **UC012** | Configurar Loja e Recebimentos | Artesão | `GET/PUT /usuarios/artesao/perfil` e `GET/PUT /usuarios/artesao/recebimentos`. |
| **UC013** | Trocar Mensagens | Cliente e Artesão | `/mensagens/conversas` e `/mensagens/conversas/:id` — conversa única por par, até 5.000 caracteres, marcação de lidas e consulta periódica. |
| **UC014** | Visitar Loja do Artesão | Cliente | `GET /usuarios/artesaos` e `GET /usuarios/artesaos/:id` — lista artesãos ativos e exibe vitrine pública individual. |
| **UC015** | Acompanhar Pedidos e Sacar Saldo | Artesão + AbacatePay | `GET /vendas/artesao`, `GET /usuarios/artesao/saldo`, `GET/POST /usuarios/artesao/saques` — saque mínimo `R$ 3,50`, confirmado por webhook (`transfer.completed` / `transfer.failed`). |
| **UC016** | Gerenciar Banners | Administrador | `/banners` — criação (até 10 banners), edição, ativação/desativação, ordenação e exclusão. |
| **UC017** | Gerenciar Contas de Usuários | Administrador / Super Admin | `/usuarios/indicadores`, `/usuarios/clientes-vendedores`, `PUT` e `DELETE /usuarios/:id` — exclusão lógica (*soft delete*) restrita ao Super Admin, revogação de sessões e log em `admin_audit_logs`. |
| **UC018** | Gerenciar Administradores | Super Admin | `/usuarios/administradores` — cria admins, altera e-mail/senha, desativa, reativa e exclui logicamente com auditoria. |
| **UC019** | Gerenciar Perfil e Pedidos | Cliente | `PUT /usuarios/me`, `GET /vendas/me` e rotas do Better Auth — visão geral, histórico de pedidos, edição de dados e troca de senha. |
