# Arquitetura de Software (v2.0)

**Versão:** 2.0 (Marketplace Multi-Artesãos)  
**Data:** 24/11/2026  
**Gestora do Projeto:** Samantha Yumi Tanaka | **Gerente de Projeto:** Vinicios Trindade Costa  
**Equipe:** Gabriel Cézar Peres Matos, Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó e Vinicios Trindade Costa.

[:material-file-pdf-box: Baixar Documento de Arquitetura v2.0 (PDF — 29 págs.)](../assets/v2/documentos/Documento_de_Arquitetura_de_Software_-_v2.0.pdf){ .md-button .md-button--primary }
[:material-file-pdf-box: Baixar Diagrama de Implantação UML (PDF)](../assets/v2/documentos/Diagrama_de_Implantacao_UML.pdf){ .md-button }

---

## 1. Modelo Arquitetural 4+1 de Kruchten

A arquitetura do **Sorriso do Cerrado v2.0** é documentada segundo o modelo de visões **4+1 de Philippe Kruchten** complementado pela **Visão de Dados**, garantindo rastreabilidade completa entre requisitos, código-fonte e infraestrutura:

| Visão | Público-Alvo | Foco Arquitetural | Artefatos Principais |
| :--- | :--- | :--- | :--- |
| **Casos de Uso (+1)** | Todos os stakeholders | Requisitos funcionais e cenários reais | [Diagrama de Casos de Uso (19 UCs)](../diagramas/casos-de-uso.md) e [12 Diagramas de Atividades](../diagramas/atividades.md) |
| **Lógica** | Analistas e arquitetos | Camadas, pacotes e responsabilidades | [Diagrama de Arquitetura e Pacotes](../diagramas/arquitetura.md) |
| **Implementação** | Programadores | Classes, módulos e interações estáticas/dinâmicas | [6 Diagramas de Classes](../diagramas/classes.md) e [4 Diagramas de Sequência](../diagramas/sequencia.md) |
| **Processo** | Integradores | Concorrência, polling assíncrono e webhooks | [Sequência Checkout Pix + Webhook (UC007)](../diagramas/sequencia.md#2-uc007-finalizar-compra-pix-com-split-e-webhook) |
| **Dados** | Especialistas / DBAs | Esquema relacional, integridade e criptografia | [Modelo de Dados (`DADOS.pdf`)](modelo-de-dados.md) |
| **Implantação** | DevOps / Config. | Contêineres Docker Compose, rede e serviços externos | [Diagrama de Implantação UML](../diagramas/arquitetura.md#3-diagrama-de-implantacao-uml-docker-compose) |

---

## 2. Requisitos e Restrições Arquiteturais

| Requisito | Decisão Arquitetural Implementada |
| :--- | :--- |
| **Linguagem** | TypeScript de ponta a ponta — Front-End em **React 19 + Vite 6** e Back-End em **Node.js 22 + Fastify 5** (executado com `tsx`). |
| **Plataforma** | Aplicação web responsiva (Chrome/Edge) servida por 3 contêineres orquestrados com **Docker Compose** (`sorriso_frontend`, `sorriso_backend` e `sorriso_mysql`). |
| **Segurança** | **Better Auth** (e-mail/senha com hash, sessão persistida em banco e cookie HTTP validado a cada requisição via `preHandler autenticar`), controle por papéis (`autorizar`), bloqueio de contas desativadas e trilha em `admin_audit_logs`. |
| **Persistência** | **MySQL 8** com **Drizzle ORM** e migrações versionadas (`0000` a `0011`) aplicadas automaticamente na inicialização do back-end, com transações ACID em operações compostas. |
| **Pagamentos** | **AbacatePay API v2**: cobrança Pix transparente com *split* automático entre plataforma e subcontas de artesãos, consulta de saldo, saques e confirmação assíncrona via webhook com validação de segredo (`X-Webhook-Secret`), assinatura **HMAC-SHA256** e controle de idempotência (`eventos_abacatepay`). |
| **Proteção de Dados** | Dados pessoais e financeiros do artesão (CPF/CNPJ, endereço, chave Pix e conta bancária) cifrados com **AES-256-GCM** usando a chave obrigatória `ARTESAO_DADOS_ENCRYPTION_KEY`. |
| **Internacionalização** | Desenvolvido inicialmente em português (`pt-BR`), com estrutura preparada para futura internacionalização (i18n). |

---

## 3. Visão Lógica (Camadas e Pacotes)

O sistema adota **Arquitetura em Camadas (*Layered Architecture*)** com separação estrita entre cliente SPA e API RESTful:

1. **Camada Cliente (Navegador — `Front-End/src`):** SPA React 19 + Vite 6 organizada em `pages`, `componentes`, `context` (`AuthContext`, `CarrinhoContext`, `NotificacaoContext`, `ThemeContext`), `hooks` (`useBuscaProdutos`, `useFavoritosIds`) e `auth` (`auth-client`, `RotaProtegida`, `RotaAdmin`). As telas consomem a API via Axios com `withCredentials` (cookie de sessão).
2. **Camada de API REST (`Back-End/src/routes` e `middleware`):** servidor Fastify 5 (`app.ts`) com CORS, upload multipart até 10 MB (`/uploads/`), rotas REST (`produtos`, `usuarios`, `vendas`, `favoritos`, `banners`, `mensagens`, `upload`), receptor de webhooks (`/webhooks/abacatepay`) e *preHandlers* `autenticar` / `autorizar`.
3. **Camada de Autenticação (Transversal — `Back-End/src/auth/better-auth.ts`):** gestão de cadastro, login, hash de senha e sessões em `/api/auth/*`.
4. **Camada de Negócio (`controllers` e `services`):** regras de validação e serviços de integração externa (`abacatePayService` e `subcontaArtesaoService`).
5. **Camada de Persistência (`models` e `database`):** consultas parametrizadas com Drizzle ORM, transações, seed do Super Admin inicial e cifragem AES-256-GCM (não há camada de repositórios separada; os *models* cumprem esse papel).

---

## 4. Visão de Processo (Concorrência e Assincronismo)

O fluxo concorrente mais crítico do marketplace é o **Checkout Pix com Split e Webhook**:
* A requisição síncrona `POST /vendas` recalcula os valores no banco, garante a subconta de cada artesão, cria a cobrança Pix na AbacatePay (validade de 15 min) e grava a venda como `pendente`.
* Em seguida, **dois processos correm em paralelo**:
    1. **Consulta periódica (*polling*):** o front-end consulta `GET /vendas/:id/pagamento` a cada **5 segundos**.
    2. **Confirmação assíncrona (*webhook*):** a AbacatePay envia `POST /webhooks/abacatepay` (`transparent.completed`), validado por `X-Webhook-Secret`, assinatura **HMAC-SHA256** do corpo bruto e verificação de ambiente (`devMode`), gravando o evento em `eventos_abacatepay` dentro de uma transação para garantir **idempotência**.
* Os **saques de artesãos** seguem o mesmo padrão assíncrono com os eventos `transfer.completed` e `transfer.failed`.

---

## 5. Visão de Implantação, Dimensionamento e Performance

### 5.1 Contêineres Docker Compose
* `sorriso_frontend` (`node:22`, porta `5173`): servidor Vite entregando a SPA React.
* `sorriso_backend` (`node:22`, porta `3000`): API Fastify + Better Auth, volume `Back-End/uploads` para mídias, migrações automáticas e seed inicial.
* `sorriso_mysql` (`mysql:8`, porta `3306` interna / `3307` externa): banco `sorrisodb` persistido no volume `mysql_data`.
* **Serviço externo:** `api.abacatepay.com/v2` via HTTPS (443) com chave `abc_dev_` (testes) ou `abc_prod_` (produção).

### 5.2 Estimativas de Volume e Performance
* **Volume Inicial Estimado:** 100 usuários cadastrados, 50 acessos/dia, 10 usuários simultâneos em pico, sessão média de 8 minutos, ~50 MB de dados e 30 produtos iniciais.
* **Metas de Performance:** até **3s** para transações principais e escritas, **2s** em média para requisições simples e suporte a até **30 usuários simultâneos**.

---

## 6. Matriz de Qualidade (Avaliação frente ao Código)

Na versão 2.0 do Documento de Arquitetura, cada mecanismo de qualidade foi auditado frente ao código real com os status **`[implementado]`**, **`[parcial]`** ou **`[planejado]`**:

| Atributo de Qualidade | Status dos Mecanismos |
| :--- | :--- |
| **Escalabilidade** | Arquitetura em camadas `[implementado]`; Indexação `[parcial: PKs e UKs]`; Paginação `[planejado]`; Cache de imagens estáticas `[planejado]`. |
| **Adequação Funcional** | Modularização do sistema em funções e domínios `[implementado]`. |
| **Confiabilidade** | Transações no banco `[implementado]`; Tratamento de exceções `[implementado]`; Validação de dados `[parcial]`. |
| **Portabilidade** | Tecnologias-padrão `[implementado]`; Variáveis de ambiente e Docker Compose `[implementado]`. |
| **Segurança** | Hash de senhas, controle de permissões e controle de sessão `[implementado]`; Proteção contra injeção `[parcial: ORM parametrizado; upload sem validação de tipo]`; HTTPS em produção `[planejado]`. |
| **Usabilidade** | Organização visual, simplificação dos fluxos, retorno visual de ações e responsividade `[implementado]`. |
| **Compatibilidade** | Testes sistemáticos de suporte a múltiplos aparelhos `[planejado]`. |
| **Manutenibilidade** | Arquitetura em camadas, separação front/back, controle de versão, padronização e documentação `[implementado]`. |
| **Desempenho** | Indexação `[parcial]`; Cache de estáticos, compressão de imagem e *Lazy Loading* `[planejado]`. |
| **Integridade de Dados** | Constraints no banco e Transações ACID `[implementado]`; Validação server-side `[parcial: cadastro de produto sem validação completa no back-end]`. |
| **Auditoria e Rastreabilidade** | Registro de alterações administrativas (`admin_audit_logs`) e histórico de pedidos `[implementado]`; Logs de login `[planejado]`. |
| **Controle de Acesso** | Proteção de rotas administrativas, autenticação com sessão e separação de perfis (`cliente`, `artisan`, `admin`, `super_admin`) `[implementado]`. |
| **Disponibilidade** | Tratamento das páginas de erro `[parcial]`; Backups periódicos e hospedagem em servidor confiável `[planejado]`. |
| **Interoperabilidade** | APIs REST e suporte a gateway de pagamento (AbacatePay) `[implementado]`; Exportação CSV/JSON `[planejado]`. |

---

## 7. Riscos e Pendências Arquiteturais Identificados

Transparência técnica registrada na auditoria de 24/11/2026 (Seção 12 do Documento de Arquitetura v2.0):

1. **Estoque no checkout:** o checkout ainda não confere nem reduz o estoque automaticamente após o pagamento (melhoria planejada: validar em `montarPedido` e baixar na transação do webhook).
2. **Upload de arquivos:** a rota `POST /upload` ainda não exige autenticação nem valida o MIME/tipo do arquivo, servindo arquivos na mesma origem da API.
3. **Vínculo de pedidos ao e-mail:** histórico e consulta de pagamento vinculam a venda pelo e-mail do cliente; recomenda-se gravar também o `user_id` na tabela `vendas`.
4. **Produtos cadastrados por administrador:** não possuem subconta de artesão vinculada, retornando HTTP `409` no checkout com split ativo.
5. **URL fixa em telas do front-end:** algumas telas ainda usam `http://localhost:3000` diretamente em vez de `VITE_API_URL`.
6. **Modelos legados de artesão:** `artesao_cadastros` (campo cifrado legado + subconta) e `artesao_perfis` coexistem e podem ser consolidados futuramente.
7. **Default de data fixo no schema:** `favoritos.data` e `vendas.data` utilizam `default(new Date())` na definição de migração.
8. **Ambiente e HTTPS para produção:** os contêineres rodam atualmente em modo desenvolvimento sem TLS/HTTPS configurado (obrigatório antes da ida a produção).
