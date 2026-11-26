# Diagramas de Atividades (12 Fluxos Atualizados)

Esta seção apresenta todos os **12 Diagramas de Atividades UML** atualizados para a **Versão 3.0** do sistema **Sorriso do Cerrado**, modelados em Draw.io com raias de responsabilidade (*swimlanes*) e acompanhados de seus respectivos arquivos editáveis `.drawio`.

---

## 1. Fazer Login

Ilustra o fluxo de autenticação por credenciais, tratamento de acesso negado, redefinição/recuperação de senha e redirecionamento para a página inicial.

![Diagrama de Atividades - Fazer Login](../assets/v2/diagramas/atividades/1-FazerLogin.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/1-FazerLogin.drawio){ .md-button download="" }

---

## 2. Navegar no Catálogo

Apresenta o carregamento da lista de produtos, opções de busca e filtragem e visualização dos detalhes de cada peça artesanal.

![Diagrama de Atividades - Navegar no Catálogo](../assets/v2/diagramas/atividades/2-NavegarCatalogo.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/2-NavegarCatalogo.drawio){ .md-button download="" }

---

## 3. Gerenciar Carrinho

Detalha a verificação de itens no carrinho, tratamento de carrinho vazio, alteração de quantidades, exclusão de itens, checagem de autenticação e prosseguimento para pagamento.

![Diagrama de Atividades - Gerenciar Carrinho](../assets/v2/diagramas/atividades/3-GerenciarCarrinho.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/3-GerenciarCarrinho.drawio){ .md-button download="" }

---

## 4. Visualizar Painel de Controle

Destaca a validação de credenciais e verificação do perfil de artesão para liberar o painel de controle (**Resumo/AbacatePay, Produtos, Pedidos, Configurações e Saques**), ou notificar acesso negado redirecionando à página inicial.

![Diagrama de Atividades - Visualizar Painel de Controle](../assets/v2/diagramas/atividades/4-PainelControle.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/4-PainelControle.drawio){ .md-button download="" }

---

## 5. Adicionar Produto

Fluxo em três raias (**Artesão**, **Sistema** e **Banco de Dados**) para inclusão de novos artesanatos no catálogo com validação de campos, tratamento de falhas e atualização da lista.

![Diagrama de Atividades - Adicionar Produto](../assets/v2/diagramas/atividades/5-AdicionarProduto.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/5-AdicionarProduto.drawio){ .md-button download="" }

---

## 6. Favoritar Produto

Modela a alternância (*toggle*) de produtos favoritos mediante verificação de sessão autenticada e consulta prévia ao banco.

![Diagrama de Atividades - Favoritar Produto](../assets/v2/diagramas/atividades/6-FavoritarProduto.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/6-FavoritarProduto.drawio){ .md-button download="" }

---

## 7. Gerenciar Produtos do Catálogo

Detalha as operações de edição e exclusão de produtos no catálogo do artesão, com confirmação explícita de remoção e validação dos dados alterados.

![Diagrama de Atividades - Gerenciar Produtos do Catálogo](../assets/v2/diagramas/atividades/7-ManterCatalogo.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/7-ManterCatalogo.drawio){ .md-button download="" }

---

## 8. Pesquisar Produto

Fluxo iterativo combinando busca por termo, aplicação de filtros dinâmicos, exibição de *"Nenhum produto encontrado"* e refinamento contínuo.

![Diagrama de Atividades - Pesquisar Produto](../assets/v2/diagramas/atividades/8-PesquisarProduto.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/8-PesquisarProduto.drawio){ .md-button download="" }

---

## 9. Finalizar Compra

Fluxo em três raias (**Cliente**, **Sistema** e **Banco de Dados**) cobrindo cálculo do valor total, conferência de estoque, confirmação da compra, solicitação do pagamento e registro da venda.

![Diagrama de Atividades - Finalizar Compra](../assets/v2/diagramas/atividades/9-FinalizarCompra.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/9-FinalizarCompra.drawio){ .md-button download="" }

---

## 10. Cadastro de Usuário / Cliente

Modela o registro de novas contas com validação de dados, checagem de duplicidade no banco, alerta de conta existente e persistência.

![Diagrama de Atividades - Cadastro de Usuário/Cliente](../assets/v2/diagramas/atividades/10-CadastroCliente.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/10-CadastroCliente.drawio){ .md-button download="" }

---

## 11. Enviar Mensagem para a Loja

Detalha a comunicação direta iniciada na loja pública: verificação de sessão ativa, consulta de conversa única por pares na base, carregamento ou abertura de nova conversa na **Central de Mensagens** e tratamento de erros de envio.

![Diagrama de Atividades - Enviar Mensagem para a Loja](../assets/v2/diagramas/atividades/11-EnviarMensagem.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/11-EnviarMensagem.drawio){ .md-button download="" }

---

## 12. Gerenciar Loja e Recebimentos do Artesão

Modela o acesso ao Painel do Artesão com carregamento da aba **Resumo** (métricas e gráficos) e os fluxos de edição em **Dados de Recebimento** e **Configurações da Loja**, com validação de campos e feedback ao usuário.

![Diagrama de Atividades - Gerenciar Loja e Recebimentos do Artesão](../assets/v2/diagramas/atividades/12-GerenciarLojaRecebimento.png)

[:material-download: Baixar (.drawio)](../assets/v2/diagramas/atividades/12-GerenciarLojaRecebimento.drawio){ .md-button download="" }
