# Galeria de Evidências dos Testes

Esta seção reúne as principais evidências fotográficas das execuções de testes unitários (Jest), testes de API (Postman) e testes End-to-End (Cypress).

---

## Evidências Principais de Execução

### 1. Execuções em Jest e Postman (Testes Unitários e API)

| Evidência | Descrição do Teste |
| :---: | :--- |
| ![Evidência 1](../assets/evidencias/principais/1.png) | **Figura 1:** Execução do teste unitário `validarEmail.test.js` no Jest com status **PASS**. |
| ![Evidência 2](../assets/evidencias/principais/2.png) | **Figura 2:** Validação unitária de restrição para preços estritamente positivos. |
| ![Evidência 3](../assets/evidencias/principais/3.png) | **Figura 3:** Teste unitário de adição de novo item ao carrinho no Jest. |
| ![Evidência 4](../assets/evidencias/principais/4.png) | **Figura 4:** Teste de incremento de quantidade de item já existente no carrinho. |
| ![Evidência 5](../assets/evidencias/principais/5.png) | **Figura 5:** Validação de privilégios de administrador via token JWT (`login.test.js`). |
| ![Evidência 6](../assets/evidencias/principais/6.png) | **Figura 6:** Requisição Postman autenticando usuário cliente (HTTP 200). |
| ![Evidência 7](../assets/evidencias/principais/7.png) | **Figura 7:** Requisição Postman autenticando artesã administradora com permissões elevadas. |
| ![Evidência 8](../assets/evidencias/principais/8.png) | **Figura 8:** Bloqueio de rota administrativa `/banners` para usuário cliente (HTTP 403 Forbidden). |
| ![Evidência 9](../assets/evidencias/principais/9.png) | **Figura 9:** Acesso autorizado à rota administrativa com token de administradora. |

---

### 2. Execuções em Cypress (Testes End-to-End no Navegador)

| Evidência | Descrição do Teste |
| :---: | :--- |
| ![Evidência 10](../assets/evidencias/principais/10.png) | **Figura 10:** Upload de imagem de banner via multipart form-data aprovado. |
| ![Evidência 11](../assets/evidencias/principais/11.png) | **Figura 11:** Teste de validação de unicidade de e-mail ao atualizar perfil. |
| ![Evidência 12](../assets/evidencias/principais/12.png) | **Figura 12:** Consulta a produto inexistente retornando 404 Not Found. |
| ![Evidência 13](../assets/evidencias/principais/13.png) | **Figura 13:** Cypress Test Runner aberto executando suíte de testes. |
| ![Evidência 14](../assets/evidencias/principais/14.png) | **Figura 14:** Execução aprovada do teste de favoritos persistentes (`favoritos-copy-1.cy.js`). |
| ![Evidência 15](../assets/evidencias/principais/15.png) | **Figura 15:** Validação Cypress de cálculo de soma do carrinho de compras. |
| ![Evidência 16](../assets/evidencias/principais/16.png) | **Figura 16:** Teste de navegação até o catálogo via navbar (`detalhesProduto.cy.js`). |
| ![Evidência 17](../assets/evidencias/principais/17.png) | **Figura 17:** Teste completo do fluxo do carrinho de compras via Cypress. |
| ![Evidência 18](../assets/evidencias/principais/18.png) | **Figura 18:** Resumo consolidado de todas as suítes Cypress com 100% de sucesso. |

---

## Evidências Completas (Apêndice Geral)
Para visualização de todas as 39 capturas de tela do apêndice integral dos testes, consulte os arquivos disponíveis no diretório de ativos: `docs/assets/evidencias/completas/`.
