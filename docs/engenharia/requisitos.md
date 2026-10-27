# Especificação de Requisitos de Software

**Versão:** 2.0  
**Data:** 08/04/2026  
**Documento Base:** Documento de Requisitos de Software e Especificação de Casos de Uso (v2.0)

---

## 1. Requisitos Funcionais (RF)

Os requisitos funcionais definem os serviços, recursos e comportamentos que o sistema **Sorriso do Cerrado** disponibiliza aos seus usuários.

### 1.1 Módulo Administrativo (Artesã)

| Identificador | Nome do Requisito | Descrição | Prioridade |
| :---: | :--- | :--- | :---: |
| **RF001** | Autenticação Administrativa | O sistema deve permitir que a administradora realize login seguro com e-mail e senha para acessar as funcionalidades restritas de gestão. | **Essencial** |
| **RF002** | Cadastro de Produtos | A artesã deve poder cadastrar novas peças artesanais, informando nome, descrição detalhada, preço unitário, quantidade em estoque e imagem. | **Essencial** |
| **RF003** | Manutenção do Catálogo (CRUD) | O sistema deve permitir a edição de informações cadastrais e a remoção de itens cadastrados no banco de dados. | **Essencial** |
| **RF004** | Painel de Controle de Estoque | O sistema deve exibir uma tela de painel com a listagem tabular de todos os produtos cadastrados, preços, códigos e estoques para conferência ágil. | **Essencial** |
| **RF005** | Gerenciamento de Banners | O sistema deve permitir à administradora enviar novas imagens de destaque para o carrossel principal da página inicial. | **Importante** |

### 1.2 Módulo do Cliente (Consumidor)

| Identificador | Nome do Requisito | Descrição | Prioridade |
| :---: | :--- | :--- | :---: |
| **RF006** | Vitrine e Destaques | A página inicial deve apresentar os produtos artesanais em destaque e seções temáticas de boas-vindas. | **Essencial** |
| **RF007** | Navegação no Catálogo | O cliente deve poder visualizar todos os produtos artesanais disponíveis organizados em formato de grade (*grid*). | **Essencial** |
| **RF008** | Pesquisa Textual | O sistema deve oferecer um campo de pesquisa para filtrar peças por nome e termos descritivos em tempo real. | **Essencial** |
| **RF009** | Detalhes do Produto | O usuário deve poder acessar a página individual do produto com foto em alta resolução, descrição técnica, estoque e preço. | **Essencial** |
| **RF010** | Carrinho de Compras | O cliente deve conseguir adicionar peças ao carrinho, alterar quantidades, remover itens e visualizar o subtotal atualizado. | **Essencial** |
| **RF011** | Lista de Favoritos | O usuário autenticado deve conseguir salvar itens em uma lista de favoritos que permanece vinculada ao seu perfil. | **Importante** |
| **RF012** | Cadastro de Clientes | O sistema deve permitir que novos clientes criem contas informando nome, e-mail, telefone e senha. | **Essencial** |
| **RF013** | Finalização de Intenção de Compra | O sistema deve consolidar os itens do carrinho e direcionar o cliente para contato direto com a artesã com os dados do pedido. | **Essencial** |

---

## 2. Requisitos Não Funcionais (RNF)

Os requisitos não funcionais determinam os atributos de qualidade, confiabilidade, desempenho e restrições técnicas da solução.

### 2.1 Usabilidade e Acessibilidade (RNF001 - RNF002)
* **RNF001 — Interface Intuitiva e Inclusiva:** A aplicação deve apresentar layout limpo, tipografia legível, botões de alto contraste e navegação descomplicada, atendendo pessoas de baixa afinidade digital.
* **RNF002 — Design Totalmente Responsivo:** O layout deve adaptar-se de maneira fluida a telas de smartphones, tablets e computadores desktop.

### 2.2 Desempenho e Eficiência (RNF003 - RNF006)
* **RNF003 — Arquitetura SPA:** O front-end em React deve atualizar as visões sem recarregamento completo da página, proporcionando sensação instantânea de navegação.
* **RNF004 — Tempo de Resposta:** As páginas de catálogo e detalhes de produto devem carregar em até **2 a 3 segundos** sob conexões residenciais padrão.
* **RNF005 — Compatibilidade entre Navegadores:** O sistema deve executar com total fidelidade no Google Chrome, Microsoft Edge, Mozilla Firefox e Safari.
* **RNF006 — Escalabilidade de Dados:** O banco MySQL e a API REST devem estar estruturados com índices para suportar centenas de produtos simultâneos sem degradação.

### 2.3 Segurança e Integridade (RNF007 - RNF009)
* **RNF007 — Autenticação via Tokens JWT:** As rotas administrativas e ações protegidas devem exigir cabeçalho `Authorization: Bearer <token>`, rejeitando acessos não autorizados com código HTTP 401/403.
* **RNF008 — Proteção de Senhas:** As credenciais dos usuários devem ser armazenadas utilizando algoritmos modernos de hash (como bcrypt), nunca em texto plano.
* **RNF009 — Consistência Transacional:** Operações que alteram dados e estoque devem garantir integridade referencial nas tabelas relacionais do MySQL.

### 2.4 Disponibilidade e Manutenibilidade (RNF010 - RNF011)
* **RNF010 — Meta de Disponibilidade:** O sistema deve operar com disponibilidade projetada de **99,8%** do tempo.
* **RNF011 — Modularidade e Documentação:** O código-fonte deve ser modularizado em TypeScript, com documentação viva e diagramas atualizados para facilitar a evolução contínua.
