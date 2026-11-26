# Relatório de Qualidade, Execuções e Pendências (v2.0)

**Versão:** 2.0 (Consolidado — 24/11/2026)  
**Fontes:** Documento de Arquitetura de Software v2.0 (Seções 11 e 12), suíte automatizada (`testes/`) e Relatório Oficial de Testes de Software.

---

## 1. Resumo das Execuções Automatizadas

| Suíte de Testes | Tecnologia | Cobertura Principal | Resultado |
| :--- | :--- | :--- | :---: |
| **Fluxo Integrado Better Auth & RBAC** | Python + Docker Compose (`e2e_flow_test.py`) | Cadastro, login, sessão, alteração de e-mail/senha, favoritos, venda, bloqueio `403` e exclusão admin | **Aprovado** |
| **Banners e Upload Multipart** | Python + Docker Compose (`banner_creation_test.py`) | Login admin, criação de banner por URL e via upload PNG, verificação em `GET /banners` | **Aprovado** |
| **Unitários de Domínio** | Jest (`validarEmail`, `carrinho`, `login`) | 5 casos de regras de negócio centrais | **100% (5/5)** |
| **API / Integração (Base v1.0)** | Postman / Thunder Client | 3 casos de contratos HTTP e permissões | **100% (3/3)** |
| **End-to-End no Navegador** | Cypress | 4 cenários de vitrine, favoritos e carrinho | **100% (4/4)** |

---

## 2. Auditoria de Qualidade da Versão 2.0 (Arquitetura vs. Código)

Na atualização de 24/11/2026, todos os requisitos de qualidade foram auditados diretamente no código-fonte:

| Dimensão | Mecanismos Implementados | Parciais / Planejados |
| :--- | :--- | :--- |
| **Segurança & Acesso** | Hash de senhas, sessões Better Auth por cookie, controle de papéis (`cliente`, `artisan`, `admin`, `super_admin`), AES-256-GCM para dados dos artesãos, webhooks HMAC-SHA256, `admin_audit_logs` e *soft delete*. | Validação de tipo MIME em `POST /upload` `[parcial]`; HTTPS em produção `[planejado]`; logs de login `[planejado]`. |
| **Integridade & Confiabilidade** | Constraints relacionais no MySQL, transações ACID, idempotência de webhooks (`eventos_abacatepay`) e tratamento de exceções. | Validação server-side no cadastro de produto `[parcial]`; baixa automática de estoque no checkout `[planejado]`. |
| **Usabilidade & Portabilidade** | Layout responsivo, feedback visual, Docker Compose com variáveis de ambiente e tecnologias web padronizadas. | Testes sistemáticos multi-dispositivos `[planejado]`. |
| **Escalabilidade & Desempenho** | Arquitetura em camadas e chaves primárias/únicas. | Paginação, cache de estáticos, compressão de imagens e *lazy loading* `[planejado]`. |

---

## 3. Registro de Pendências Técnicas Mapeadas (Roadmap de Correção)

Abaixo estão os apontamentos transparentes levantados durante a revisão técnica de 24/11/2026 (Seção 12 do Documento de Arquitetura v2.0):

| # | Área | Severidade | Descrição e Ação Recomendada |
| :---: | :--- | :---: | :--- |
| **1** | **Estoque no Checkout** | Alta | O checkout ainda não confere nem reduz o estoque automaticamente após o pagamento. *Ação:* validar em `montarPedido` e baixar na transação do webhook. |
| **2** | **Segurança de Upload** | Alta | `POST /upload` ainda não exige autenticação nem restringe tipos MIME (evitar HTML/SVG na mesma origem do cookie). |
| **3** | **Vínculo de Pedidos** | Média | Consulta de pedidos usa o e-mail do cliente; recomenda-se persistir também `user_id` na tabela `vendas`. |
| **4** | **Produtos sem Artesão** | Média | Produtos cadastrados por administrador sem subconta retornam `409` no checkout com split ativo. |
| **5** | **Configuração de URL** | Média | Algumas telas usam `http://localhost:3000` diretamente em vez de `VITE_API_URL`. |
| **6** | **Consolidação de Tabelas** | Baixa | Coexistência de `artesao_cadastros` (legado + subconta) e `artesao_perfis`. |
| **7** | **Default de Data no Schema** | Baixa | `favoritos.data` e `vendas.data` com `default(new Date())` fixado na migração. |
| **8** | **Ambiente de Produção** | Alta | Configurar TLS/HTTPS, credenciais seguras e endereço público de webhook antes do deploy produtivo. |

---

*Para consultar o relatório completo e a matriz de 16 defeitos da Versão 1.0, acesse [Relatório de Testes (Semestre Anterior)](../semestre-anterior/testes/relatorio-de-testes.md).*
