# Histórias de Usuário (User Stories)

**Documento de Origem:** Documentação de Testes de Software — Sorriso do Cerrado  
**Padrão:** Como [papel], eu quero [ação] para que [benefício/valor de negócio].

---

## Módulo de Autenticação

### HU01 — Login no Sistema
* **Descrição:** Como usuário (cliente ou administrador), eu quero realizar login utilizando meu e-mail e senha cadastrados para acessar as funcionalidades exclusivas da plataforma de acordo com o meu perfil.
* **Critérios de Aceitação:**
    * Validar se os campos obrigatórios (e-mail e senha) foram preenchidos.
    * Retornar mensagem clara de erro caso o e-mail não exista ou a senha seja incorreta.
    * Redirecionar administradores para `/painel-de-controle` e clientes para a tela inicial.
    * Gerar token JWT com payload contendo `id`, `email` e permissão de `isAdmin`.

### HU02 — Cadastro de Usuário
* **Descrição:** Como novo cliente, eu quero criar uma conta no sistema informando meus dados pessoais para poder salvar meus produtos favoritos e gerenciar meus pedidos.
* **Critérios de Aceitação:**
    * Validar formato válido de e-mail (presença de `@` e domínio válido).
    * Impedir o cadastro de e-mails duplicados no banco de dados.
    * Garantir tamanho mínimo seguro de senha (mínimo de 6 caracteres).

---

## Módulo de Catálogo e Produtos

### HU03 — Visualização do Catálogo
* **Descrição:** Como consumidor, eu quero visualizar todas as peças artesanais em uma grade organizada para conhecer as opções disponíveis para compra.
* **Critérios de Aceitação:**
    * Exibir imagem, título, preço formatado em Real (R$) e botão de ação para cada card.
    * Indicar visualmente itens esgotados sem interromper a navegação dos demais.

### HU04 — Pesquisa de Produtos
* **Descrição:** Como cliente, eu quero pesquisar produtos digitando termos no campo de busca para encontrar rapidamente o artesanato desejado.
* **Critérios de Aceitação:**
    * Filtrar produtos com correspondência insensível a maiúsculas/minúsculas.
    * Exibir mensagem amigável *"Nenhum produto encontrado"* caso a busca não retorne itens.

### HU05 — Ver Detalhes do Produto
* **Descrição:** Como cliente, eu quero clicar em um produto e ver sua página de detalhes para conhecer suas dimensões, materiais do Cerrado utilizados e disponibilidade.
* **Critérios de Aceitação:**
    * Exibir foto ampliada, descrição completa e valor unitário.
    * Permitir adicionar a peça ao carrinho diretamente a partir dessa tela.

---

## Módulo de Favoritos

### HU06 — Favoritar Produto
* **Descrição:** Como cliente autenticado, eu quero clicar no ícone de coração de um produto para adicioná-lo à minha lista pessoal de favoritos.
* **Critérios de Aceitação:**
    * Alternar estado do ícone (preenchido/vazio) ao clicar.
    * Se o usuário não estiver logado, redirecionar para a tela de login.
    * Persistir a lista de favoritos no banco de dados, recuperando-a em novos acessos.

---

## Módulo de Carrinho e Checkout

### HU07 — Adicionar ao Carrinho
* **Descrição:** Como cliente, eu quero adicionar produtos ao carrinho de compras para acumular várias peças em uma mesma compra.
* **Critérios de Aceitação:**
    * Se o produto for novo no carrinho, inseri-lo com quantidade 1.
    * Se o produto já estiver no carrinho, incrementar sua quantidade.
    * Atualizar dinamicamente o contador numérico de itens no ícone do cabeçalho.

### HU08 — Gerenciar Carrinho
* **Descrição:** Como cliente, eu quero alterar as quantidades ou remover itens do meu carrinho para ajustar meu pedido antes da finalização.
* **Critérios de Aceitação:**
    * Recalcular o valor total imediatamente após qualquer alteração de quantidade.
    * Exibir botão para remoção individual de itens.
    * Apresentar estado amigável de *"Carrinho Vazio"* com botão para retornar ao catálogo.

### HU09 — Finalizar Intenção de Compra
* **Descrição:** Como cliente, eu quero concluir meu pedido gerando um resumo com valor total para combinar o pagamento e a entrega diretamente com a artesã.
* **Critérios de Aceitação:**
    * Validar se todos os itens possuem estoque disponível.
    * Montar mensagem detalhada com os itens, quantidades e valor total.
    * Encaminhar o pedido com canal direto de confirmação.
