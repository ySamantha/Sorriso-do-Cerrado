# Documento de Visão — Sorriso do Cerrado (v2.1)

**Versão:** 2.1 (Alinhada ao código do repositório)  
**Data:** 24/11/2026  
**Autores:** Gabriel Cézar Peres Matos, Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó e Vinicios Trindade Costa.

[:material-file-pdf-box: Baixar Documento de Visão v2.1 (PDF)](../assets/v2/documentos/Documento_de_Visao_-_v2.1.pdf){ .md-button .md-button--primary }
[:material-file-word-box: Baixar Versão 2.0 Editável (DOCX)](../assets/v2/documentos/Documento_de_Visao_-_v2.0.docx){ .md-button }

---

## Histórico de Revisões

| Versão | Data | Autores | Observações |
| :---: | :---: | :--- | :--- |
| **1.0** | 14/03/2026 | Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó, Vinicios Trindade Costa, Wictor Emanoel Ponte Menezes | Consolidação da visão inicial do sistema Sorriso do Cerrado (vitrine virtual monoprodutor). |
| **2.0** | 27/10/2026 | Gabriel Cézar Peres Matos, Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó, Vinicios Trindade Costa | Evolução arquitetural e de escopo: transição de vitrine virtual para marketplace. |
| **2.1** | 24/11/2026 | Gabriel Cézar Peres Matos, Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó, Vinicios Trindade Costa | Alinhamento ao código do repositório: escopo do checkout com split, stakeholders, funcionalidades, prioridades, requisitos de segurança, restrições e mecanismos arquiteturais. |

---

## 1. Introdução

### 1.1 Finalidade
Definir a visão estratégica do sistema **Sorriso do Cerrado**, estabelecendo a expansão funcional da antiga vitrine virtual para um **marketplace regional colaborativo de artesanato**, promovendo a autonomia digital, o empoderamento econômico e a visibilidade de múltiplos artesãos e comunidades.

### 1.2 Escopo
O Sorriso do Cerrado é uma aplicação web completa orientada ao modelo de marketplace de comércio eletrônico. O escopo abrange:
* Vitrine unificada de produtos artesanais com **lojas públicas por artesão**.
* Gestão autônoma de **catálogo, estoque, pedidos e recebimentos** por cada artesão.
* **Carrinho de compras com checkout único via Pix**, cujo valor é dividido automaticamente (*split*) entre a plataforma e os artesãos parceiros.
* **Central de mensagens** direta entre clientes e artesãos.
* **Administração hierárquica** da plataforma (`admin` e `super_admin`).

### 1.3 Definições, Acrônimos e Abreviações
* **ODS:** Objetivos de Desenvolvimento Sustentável.
* **CRUD:** Criar, Ler, Atualizar e Excluir dados.
* **Marketplace:** Plataforma virtual de comercialização com múltiplos vendedores.
* **API:** Interface de Programação de Aplicações.
* **Pix:** Meio de pagamento instantâneo brasileiro, usado no checkout por QR Code.
* **Split:** Divisão automática do valor de uma venda entre a plataforma (comissão) e os artesãos.
* **Subconta:** Conta de cada artesão na AbacatePay, que recebe o repasse das vendas e permite saques.
* **Webhook:** Notificação enviada pela AbacatePay ao sistema quando um pagamento ou saque é concluído.
* **Super Admin:** Administrador principal, que também gerencia as contas dos demais administradores.

---

## 2. Contextualização

### 2.1 Descrição do Problema

| Dimensão | Detalhamento |
| :--- | :--- |
| **Problemas** | • Cerca de 25% dos microempreendedores brasileiros enfrentam barreiras digitais.<br>• Ausência de um canal dedicado para comercialização digital de artesanatos. |
| **Pessoas Atingidas** | • Diretamente: dezenas de artesãos.<br>• Indiretamente: comunidade local e familiares dos artesãos. |
| **Impacto** | • Limitação da fonte de renda.<br>• Baixa visibilidade dos produtos.<br>• Dependência de vendas informais.<br>• Estagnação do empreendimento e impossibilidade de expansão. |
| **Solução Bem-Sucedida** | • Marketplace que permita o cadastro e a venda de produtos de forma autônoma, sem necessidade de infraestrutura física.<br>• Sistema responsivo e acessível com interface simplificada e intuitiva. |

### 2.2 Sentença de Posição do Produto

| Elemento | Definição |
| :--- | :--- |
| **Para** | Artesãos locais que buscam autonomia digital. |
| **Que** | Buscam alcançar o mercado digital. |
| **O** | Sorriso do Cerrado é uma plataforma de marketplace de artesanato. |
| **Diferente de** | Marketplaces genéricos, que não possuem nicho e identidade visual específicos. |
| **Nosso produto** | Proporciona interface intuitiva, inclusiva e acolhedora, com controle total sobre o catálogo de produtos. |

---

## 3. Stakeholders e Usuários

### 3.1 Principais Stakeholders

| Identificação | Responsabilidades | Stakeholders |
| :--- | :--- | :--- |
| **Equipe de Desenvolvimento** | Desenvolver, testar e manter a plataforma. | Gabriel, Pedro, Samantha, Samuel e Vinicios |
| **Administrador / Super Admin** | Gerenciar banners, acompanhar indicadores e gerenciar contas de clientes e artesãos; o Super Admin também cria, edita, desativa e exclui administradores. | Gestores da plataforma |
| **Artesão / Vendedor** | Cadastrar o perfil profissional e a loja, gerenciar produtos (preços, estoque e descrições), dados de recebimento, pedidos, saques e mensagens. | Comerciantes, artesãos |
| **Cliente** | Visualizar produtos e lojas, favoritar, utilizar o carrinho, pagar via Pix e conversar com os artesãos. | Público geral |
| **Provedor de Pagamentos** | Processar cobranças Pix, subcontas, divisão de valores (*split*) e saques. | AbacatePay (sistema externo) |

### 3.2 Necessidades-Chave

| Nº | Descrição | Prioridade | Observações |
| :---: | :--- | :---: | :--- |
| **1** | Possibilidade de cadastrar e gerenciar produtos | Crítico | Essencial para autonomia dos artesãos |
| **2** | Disponibilizar catálogo digital acessível a clientes | Crítico | Facilitar a divulgação dos produtos |
| **3** | Implementar carrinho de compras e gerenciamento do pedido | Crítico | Garante experiência completa de compra |
| **4** | Área administrativa para acompanhamento de vendas e estoque | Crítico | Necessário para gestão eficiente |
| **5** | Interface simples e intuitiva para o uso | Importante | Considera perfil com baixa familiaridade digital |
| **6** | Teste de usabilidade para garantir acessibilidade | Importante | Valida a experiência final do usuário |
| **7** | Treinamento para utilização da plataforma | Importante | Apoio inicial para adoção da solução |
| **8** | Documentação do sistema | Útil | Complementa o treinamento e facilita suporte futuro |
| **9** | Recebimento dos pagamentos diretamente por cada artesão | Crítico | Viabiliza o modelo multi-artesãos sem repasse manual |
| **10** | Comunicação direta entre clientes e artesãos | Importante | Tira dúvidas sobre peças e encomendas |

---

## 4. Visão Geral do Produto

### 4.1 Resumo das Funcionalidades

| Necessidade | Funcionalidades Correspondentes |
| :--- | :--- |
| **Exposição digital dos produtos** | Catálogo interativo de produtos artesanais com busca, filtros e ordenação, banners na página inicial e páginas públicas de loja por artesão. |
| **Realização de vendas online** | Carrinho de compras, checkout via Pix integrado à AbacatePay com divisão automática dos valores e gerenciamento de pedidos. |
| **Gestão de estoque e pedidos** | Painel do artesão com resumo de vendas, gráfico de faturamento, lista de pedidos e repasses e edição manual do estoque de cada produto. |
| **Autonomia para múltiplos vendedores** | Cadastro de artesão, configurações personalizadas da loja e gestão de dados de recebimento. |
| **Recebimento dos valores** | Saldo da subconta do artesão na AbacatePay e solicitação de saque pelo painel. |
| **Organização das compras** | Lista de favoritos salva na conta e perfil com histórico de pedidos, edição de dados e alteração de senha. |
| **Comunicação direta** | Central de mensagens entre clientes e artesãos, com contagem de mensagens não lidas. |
| **Administração da plataforma** | Painel administrativo com indicadores, gestão de contas e de administradores, auditoria e exclusão lógica (*soft delete*). |
| **Familiaridade digital** | Interface simples, responsiva e intuitiva voltada ao perfil dos usuários. |
| **Apoio na adoção da solução** | Treinamento e documentação do sistema. |

### 4.2 Estimativa de Custo Inicial
Desenvolvido como projeto acadêmico sem fins lucrativos (custo nulo de desenvolvimento para os artesãos). Custos operacionais futuros envolvem domínio e hospedagem. Em produção, a plataforma retém uma comissão configurável sobre cada venda (**10% no ambiente de testes**), somada às taxas da AbacatePay sobre transações e saques.

### 4.3 Premissas, Suposições e Dependências
* **Desenvolvedor:** Visual Studio Code, Node.js, TypeScript, React (Vite), Fastify, Drizzle ORM, Better Auth, MySQL, Docker e Docker Compose, Git/GitHub.
* **Serviços Externos:** AbacatePay API v2 (chave de teste para desenvolvimento).
* **Ambiente do Usuário:** Navegadores modernos (Google Chrome, Microsoft Edge), sem exigência de instalação local.
* **Servidor:** Orquestração em três contêineres Docker Compose (`sorriso_frontend`, `sorriso_backend` e `sorriso_mysql`). Para recebimento de webhooks em produção, o back-end requer endereço público acessível pela AbacatePay.

---

## 5. Precedência e Prioridades

| Nº | Funcionalidade | Prioridade | Entrega |
| :---: | :--- | :---: | :---: |
| 1 | Catálogo e Vitrine | Crítico | Versão 1.0 |
| 2 | Área Administrativa (CRUD) | Crítico | Versão 1.0 |
| 3 | Sistema de Carrinho | Importante | Versão 1.0 |
| 4 | Modelagem e isolamento de produtos por artesão | Crítico | Versão 2.0 |
| 5 | Páginas públicas de perfil do artesão | Importante | Versão 2.0 |
| 6 | Integração de pagamentos (AbacatePay) | Crítico | Versão 2.0 |
| 7 | Central de mensagens e painel de resumo do artesão | Importante | Versão 2.0 |
| 8 | Recebimentos do artesão (saldo e saque) | Importante | Versão 2.0 |
| 9 | Administração hierárquica (`admin` e `super_admin`), auditoria e exclusão lógica | Importante | Versão 2.0 |
| 10 | Validação e baixa automática de estoque no checkout | Importante | Planejada |

---

## 6. Requisitos Não-Funcionais e Segurança

* **Usabilidade:** interface simples, intuitiva e acessível para usuários com baixa familiaridade digital.
* **Suportabilidade:** compatibilidade com navegadores modernos e design responsivo, sem instalação local.
* **Confiabilidade:** integridade no banco de dados, tempo de resposta otimizado na vitrine e filtros, recuperação segura de erros e **idempotência** no processamento de notificações de pagamento (cada confirmação processada uma única vez).
* **Disponibilidade:** meta de 99,8% em produção (atualmente em execução local).
* **Segurança:**
    * Acesso restrito por autenticação e controle de papéis (`cliente`, `artisan`, `admin`, `super_admin`).
    * Isolamento de propriedade: apenas o artesão dono do produto (ou administrador) altera preços, estoque e descrições.
    * Senhas armazenadas em *hash* e sessões mantidas em cookie validado a cada requisição.
    * Dados pessoais e financeiros dos artesãos cifrados em repouso com **AES-256-GCM**.
    * Webhooks validados por segredo compartilhado e assinatura **HMAC-SHA256**.
    * Trilha de auditoria administrativa e desativação de contas por exclusão lógica (*soft delete*).

---

## 7. Mecanismos Arquiteturais

| Mecanismo de Análise | Mecanismo de Design | Mecanismo de Implementação |
| :--- | :--- | :--- |
| **Persistência** | Banco de Dados Relacional + ORM | MySQL + Drizzle ORM |
| **Migração de dados** | Migrações versionadas | Drizzle Kit (`migrations`) |
| **Interface de Usuário** | SPA (Single Page Application) | React.js + Vite |
| **Processamento Server-side** | API REST | Node.js / Fastify |
| **Autenticação** | Sessão em cookie e controle por papéis | Better Auth |
| **Pagamentos** | Gateway com *split* e *webhooks* | AbacatePay API v2 |
| **Proteção de dados sensíveis** | Criptografia simétrica autenticada | AES-256-GCM (`node:crypto`) |
| **Armazenamento de imagens** | Upload multipart em disco | `@fastify/multipart` + `uploads/` |
| **Implantação** | Contêineres | Docker / Docker Compose |
| **Versionamento** | Controle de Versão | Git / GitHub |
