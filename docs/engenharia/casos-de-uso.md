# Especificação de Casos de Uso

**Documento de Origem:** Documento de Requisitos de Software e Especificação de Casos de Uso (v2.0)  
**Metodologia:** Engenharia de Requisitos orientada a Casos de Uso UML.

---

## UC001 — Fazer Login
* **Atores:** Cliente, Administradora (Artesã).
* **Pré-condições:** O usuário deve acessar a tela de autenticação do sistema.
* **Fluxo Principal:**
    1. O usuário informa seu e-mail e sua senha cadastrada.
    2. O usuário clica no botão *"Entrar"*.
    3. O sistema valida as credenciais contra a base de dados MySQL.
    4. O sistema gera o token JWT contendo os atributos de sessão e o nível de acesso.
    5. Se o perfil for **Administrador**, o sistema redireciona para o Painel de Controle (`/painel-de-controle`).
    6. Se o perfil for **Cliente**, o sistema redireciona para a página inicial com a sessão ativa.
* **Fluxos Alternativos:**
    * *Recuperação/Alteração de Senha:* O usuário solicita redefinição, informa sua nova senha e conclui a atualização.
* **Exceções:**
    * *Credenciais Inválidas:* O sistema exibe notificação de erro *"E-mail ou senha inválidos"* e mantém o formulário pronto para nova tentativa.
* **Pós-condições:** Usuário autenticado, token salvo no armazenamento do navegador e contexto global de autenticação configurado.

---

## UC002 — Cadastro de Usuário (Cliente e Artesão)
* **Atores:** Cliente, Administradora.
* **Pré-condições:** Acesso à página de cadastro (`/cadastro`).
* **Fluxo Principal:**
    1. O usuário preenche os campos: Nome completo, E-mail, Telefone e Senha.
    2. O usuário envia o formulário.
    3. O sistema valida o formato dos dados (formato do e-mail, complexidade da senha).
    4. O sistema consulta a base para certificar-se de que o e-mail não foi utilizado anteriormente.
    5. O sistema criptografa a senha e persiste o novo registro.
    6. O usuário recebe confirmação e é redirecionado para realizar login.
* **Exceções:**
    * *E-mail já cadastrado:* O sistema exibe aviso informando a duplicidade.
    * *Dados incompletos:* Os campos com pendência são destacados em vermelho.
* **Pós-condições:** Nova conta criada com sucesso no banco de dados.

---

## UC003 — Visualizar Painel de Controle
* **Atores:** Administradora (Artesã).
* **Pré-condições:** Usuário autenticado com perfil com privilégios de administrador.
* **Fluxo Principal:**
    1. A administradora acessa a rota do painel.
    2. O sistema verifica a validade do token JWT e o status `isAdmin = true`.
    3. O sistema carrega a lista completa de produtos do estoque.
    4. A administradora visualiza tabela com código, foto, nome, estoque, valor e botões de ação (Editar/Excluir).
* **Exceções:**
    * *Acesso não autorizado:* Tentativas de acesso por usuários comuns ou visitantes não autenticados são bloqueadas com redirecionamento para o login.
* **Pós-condições:** Painel de controle carregado com os dados mais recentes do inventário.

---

## UC004 — Navegar no Catálogo
* **Atores:** Cliente, Visitante.
* **Pré-condições:** Nenhuma (acesso público).
* **Fluxo Principal:**
    1. O usuário acessa a página de catálogo.
    2. O sistema requisita via API REST a lista de produtos disponíveis.
    3. O sistema renderiza os cards de produtos com título, valor, foto e botões de interação.
    4. O usuário pode rolar a página, filtrar ou clicar em um item específico.
* **Pós-condições:** Catálogo exposto e responsivo.

---

## UC005 — Pesquisar Produtos
* **Atores:** Cliente, Visitante.
* **Pré-condições:** Usuário na página de catálogo ou na barra de busca superior.
* **Fluxo Principal:**
    1. O usuário digita um termo de pesquisa (ex.: *"brinco"*, *"mandala"*).
    2. O sistema filtra instantaneamente os produtos que contenham o termo.
    3. A grade de produtos exibe apenas as peças correspondentes.
* **Fluxos Alternativos:**
    * Se nenhum item corresponder ao termo, o sistema exibe mensagem amigável de ausência de resultados.
* **Pós-condições:** Lista filtrada apresentada ao usuário.

---

## UC006 — Gerenciar Carrinho
* **Atores:** Cliente.
* **Pré-condições:** Ter adicionado pelo menos um produto ao carrinho.
* **Fluxo Principal:**
    1. O cliente clica no ícone de carrinho no cabeçalho.
    2. O sistema exibe a gaveta ou página do carrinho com os itens selecionados.
    3. O cliente pode alterar a quantidade com os botões `+` e `-`.
    4. O sistema recalcula os subtotais e o total geral imediatamente.
    5. O cliente clica em *"Finalizar Compra"* ou continua comprando.
* **Fluxos Alternativos:**
    * O cliente pode remover completamente um item clicando no botão de lixeira.
* **Pós-condições:** Estado do carrinho atualizado na memória local do navegador.

---

## UC007 — Visualizar Detalhes do Produto
* **Atores:** Cliente, Visitante.
* **Pré-condições:** Selecionar um produto a partir da vitrine ou do catálogo.
* **Fluxo Principal:**
    1. O usuário clica sobre a imagem ou nome de um produto.
    2. O sistema abre a página de detalhes correspondente (`/detalhes/:id`).
    3. São exibidos: imagem expandida, nome, descrição das matérias-primas, estoque disponível e preço unitário.
    4. O usuário clica em *"Adicionar ao Carrinho"* ou *"Favoritar"*.
* **Pós-condições:** Detalhes apresentados e opções de ação disponibilizadas.

---

## UC008 — Finalizar Intenção de Compra
* **Atores:** Cliente.
* **Pré-condições:** Carrinho contendo produtos e estoque conferido.
* **Fluxo Principal:**
    1. O cliente revisa os itens e clica no botão de finalização.
    2. O sistema confere a integridade dos itens e calcula o valor final do pedido.
    3. O sistema consolida o resumo do pedido e gera a integração com o WhatsApp da artesã contendo os itens, quantidades e valor.
    4. O cliente envia a mensagem e alinha a forma de pagamento e entrega diretamente com a artesã.
* **Pós-condições:** Intenção de compra formalizada e transmitida à administradora.

---

## UC009 — Favoritar Produto
* **Atores:** Cliente.
* **Pré-condições:** Estar navegando na vitrine, catálogo ou página de detalhes.
* **Fluxo Principal:**
    1. O cliente clica no ícone de coração em um produto.
    2. O sistema verifica a autenticação do usuário.
    3. Estando logado, o sistema insere o vínculo do produto na tabela de favoritos do usuário no banco de dados.
    4. O ícone de coração é destacado com preenchimento colorido.
* **Fluxos Alternativos:**
    * Se o produto já constar nos favoritos, um novo clique remove-o da lista.
    * Se o cliente não estiver logado, o sistema solicita o login prévio.
* **Pós-condições:** Lista de favoritos persistida e sincronizada.

---

## UC010 — Manter Catálogo (Administração)
* **Atores:** Administradora (Artesã).
* **Pré-condições:** Administradora logada no Painel de Controle.
* **Fluxo Principal (Edição):**
    1. A artesã localiza o item na tabela e clica em *"Editar"*.
    2. O sistema carrega o formulário pré-preenchido com os dados atuais.
    3. A artesã modifica os dados necessários (ex.: preço ou estoque) e clica em *"Salvar"*.
    4. O sistema atualiza o registro no MySQL e recarrega a tabela.
* **Fluxo Alternativo (Exclusão):**
    1. A artesã clica em *"Excluir"* no produto desejado.
    2. O sistema exibe modal de confirmação.
    3. Com a confirmação, o registro é removido e a lista é atualizada.
* **Pós-condições:** Catálogo modificado no banco de dados e refletido em toda a plataforma.
