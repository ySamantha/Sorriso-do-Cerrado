# Documento de Visão — Sorriso do Cerrado

**Versão:** 2.0  
**Data:** 27/10/2026  
**Autores:** Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó, Vinicios Trindade Costa.

---

## Revisões do Documento

| Versão | Data | Autores | Observações |
| :---: | :---: | :--- | :--- |
| **1.0** | 14/03/2026 | Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó, Vinicios Trindade Costa, Wictor Emanoel Ponte Menezes | Consolidação da visão inicial do sistema Sorriso do Cerrado (vitrine virtual e monoprodutor). |
| **2.0** | 27/10/2026 | Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó, Vinicios Trindade Costa | Evolução arquitetural e de escopo: transição de vitrine virtual para marketplace regional colaborativo. |

---

## 1. Introdução

### 1.1. Finalidade
A finalidade deste documento é definir a visão estratégica do sistema **Sorriso do Cerrado**. O documento estabelece a expansão funcional para a transição de uma vitrine virtual para um **marketplace regional colaborativo de artesanato**, promovendo a autonomia digital, o empoderamento econômico e a visibilidade de múltiplos artesãos e comunidades.

### 1.2. Escopo
O **Sorriso do Cerrado** é uma aplicação web completa orientada ao modelo de marketplace de comércio. O escopo do sistema abrange a vitrine unificada de produtos artesanais, além de um gerenciamento administrativo de estoque e vendas autônomo, que inclui um carrinho de compras e a finalização de forma descentralizada para cada artesão parceiro.

### 1.3. Definições, Acrônimos e Abreviações
* **ODS:** Objetivos de Desenvolvimento Sustentável (ONU).
* **CRUD:** *Create, Read, Update, Delete* (Criar, Ler, Atualizar e Excluir dados).
* **API:** *Application Programming Interface* (Interface de Programação de Aplicações).
* **SPA:** *Single Page Application* (Aplicação de Página Única).
* **Marketplace:** Plataforma digital de comércio colaborativo em que múltiplos vendedores (artesãos) oferecem seus produtos em um ambiente compartilhado com gestão descentralizada.

### 1.4. Referências e Especificações Suplementares
* Documento de Regra de Negócio
* Documento de Requisitos
* Documento Manual do Usuário
* Documento Dicionário de Dados

---

## 2. Contextualização

### 2.1. Descrição do Problema

| Dimensão | Detalhamento |
| :--- | :--- |
| **Problemas** | Cerca de 25% dos microempreendedores brasileiros enfrentam barreiras digitais. Ausência de um canal estruturado para comercialização digital de artesanatos. |
| **Pessoas Atingidas** | **Diretamente:** Dezenas de artesãos locais.<br>**Indiretamente:** Comunidade local e familiares dos artesãos. |
| **Cujo Impacto é** | Limitação da fonte de renda, baixa visibilidade dos produtos, dependência de vendas informais, estagnação do empreendimento e impossibilidade de expansão. |
| **Uma Solução Bem-sucedida Traria** | Marketplace que permita o cadastro e a venda de produtos de forma autônoma, sem necessidade de infraestrutura física. Sistema responsivo e acessível com interface simplificada e intuitiva. |

### 2.2. Sentença de Posição do Produto

| Elemento | Declaração |
| :--- | :--- |
| **Para** | Artesãos locais que buscam autonomia digital. |
| **Que** | Buscam alcançar o mercado digital. |
| **O** | **Sorriso do Cerrado** é uma plataforma de marketplace de artesanato regional. |
| **Diferente de** | Marketplaces genéricos, que não possuem nicho nem identidade visual específica. |
| **Nosso Produto** | Proporciona interface intuitiva, inclusiva e acolhedora, com controle total sobre o catálogo de produtos e valorização da identidade do Cerrado. |

---

## 3. Descrição dos Stakeholders e dos Usuários

### 3.1. Principais Stakeholders e Usuários

| Identificação | Responsabilidades | Stakeholders |
| :--- | :--- | :--- |
| **Administrador** | Desenvolver, testar e manter a plataforma. | Pedro, Samantha, Samuel e Vinicios. |
| **Artesão / Vendedor** | Gerenciar dados, adicionar produtos, editar e excluir, além de definir preços e descrições. | Comerciantes e artesãos parceiros. |
| **Cliente** | Visualizar produtos, utilizar o carrinho e finalizar compras. | Público geral. |

### 3.2. Necessidades-Chave dos Stakeholders e dos Usuários

| Nº | Descrição | Prioridade | Observações |
| :---: | :--- | :---: | :--- |
| 1 | Possibilidade de cadastrar e gerenciar produtos | **Crítico** | Essencial para a autonomia dos artesãos. |
| 2 | Disponibilizar catálogo digital acessível a clientes | **Crítico** | Facilitar a divulgação dos produtos. |
| 3 | Implementar carrinho de compras e gerenciamento do pedido | **Crítico** | Garante experiência completa de compra. |
| 4 | Área administrativa para acompanhamento de vendas e do estoque | **Crítico** | Necessário para gestão eficiente. |
| 5 | Interface simples e intuitiva para o uso | **Importante** | Considera o perfil de usuário com baixa familiaridade digital. |
| 6 | Teste de usabilidade para garantir acessibilidade | **Importante** | Valida a experiência final do usuário. |
| 7 | Treinamento para utilização da plataforma | **Importante** | Apoio inicial para adoção da solução. |
| 8 | Documentação do sistema | **Útil** | Complementa o treinamento e facilita suporte futuro. |

---

## 4. Visão Geral do Produto

### 4.1. Perspectiva do Produto

#### 4.1.1. Resumo das Funcionalidades do Produto

| Necessidades | Funcionalidades Correspondentes |
| :--- | :--- |
| Exposição digital dos produtos | Catálogo de produtos artesanais interativo com filtros e descrições. |
| Realização de vendas online | Carrinho de compras e gerenciamento de pedidos. |
| Gestão de estoque e pedidos | Área administrativa para acompanhamento de vendas. |
| Autonomia na gestão do negócio para múltiplos vendedores | Interface administrativa individual para cadastrar e gerenciar produtos. |
| Familiaridade digital | Interface simples e intuitiva voltada ao perfil do usuário. |
| Apoio na adoção da solução | Treinamento e documentação do sistema. |

### 4.2. Estimativa de Custo Inicial
O desenvolvimento do sistema Sorriso do Cerrado é realizado como um projeto acadêmico sem fins lucrativos, o que resultará em um custo financeiro de execução nulo para os artesãos beneficiários. Em termos de infraestrutura operacional, os custos iniciais são baixos; o investimento a princípio seria em um domínio personalizado e, futuramente, em serviços de hospedagem.

### 4.3. Suposições e Dependências
O funcionamento pleno da aplicação dependerá do engajamento dos artesãos na manutenção regular de estoques e atualização de status de pedidos. O sistema possui dependência crítica de conectividade com a internet, devido a todas as operações realizadas por clientes e administradores, além da integridade do banco de dados para a persistência de informações de pedidos e produtos.

### 4.4. Premissas e Dependências

* **Desenvolvedor:**
  * *Hardware:* Computadores pessoais.
  * *Software:* Visual Studio Code, Node.js, React, Express, MySQL, Git/GitHub, Docker.
* **Ambiente do Usuário:** Navegadores web modernos (Google Chrome, Microsoft Edge, Safari, Firefox).
* **Máquina do Servidor:** Inicialmente, a aplicação e o banco de dados operam em ambiente de desenvolvimento local (ou em contêineres Docker), dependendo da execução simultânea dos serviços para o acesso via navegador.

---

## 5. Precedência e Prioridades

| Nº | Funcionalidade | Prioridade | Entrega |
| :---: | :--- | :---: | :---: |
| 1 | Catálogo e Vitrine | **Crítico** | Versão 1.0 |
| 2 | Área Administrativa (CRUD) | **Crítico** | Versão 1.0 |
| 3 | Sistema de Carrinho | **Importante** | Versão 1.0 |
| 4 | Modelagem e isolamento de produtos por artesão | **Crítico** | Versão 2.0 |
| 5 | Páginas públicas de perfil do artesão | **Importante** | Versão 2.0 |

---

## 6. Requisitos Não-Funcionais do Produto

* **6.1. Usabilidade:** O sistema deverá ser simples e intuitivo, visando atender usuários com baixa familiaridade tecnológica. A aplicação deverá possuir fácil navegação, com elementos visuais que auxiliem os artesãos.
* **6.2. Suportabilidade:** O sistema deverá ser compatível com navegadores web modernos, sem a necessidade de instalação local. O sistema deverá possuir design totalmente responsivo.
* **6.3. Confiabilidade:** O software deverá garantir a integridade dos dados cadastrados no banco de dados. A aplicação deve possuir um tempo de resposta otimizado para o carregamento da vitrine de produtos e para as operações de filtragem no catálogo. O sistema deve ser capaz de lidar com erros e se recuperar deles sem perda de dados ou processamento incorreto.
* **6.4. Disponibilidade:** O sistema deverá estar disponível 99,8% do tempo, continuamente.
* **6.5. Segurança:** O painel administrativo deverá ter acesso restrito mediante autenticação (JWT) para garantir a integridade dos dados. Deverá ser garantido que apenas usuários autorizados possam realizar operações de alteração de preços, estoque e descrições dos produtos.
* **6.6. Documentação:** Deverá ser elaborada uma documentação técnica e um manual do usuário para facilitar a manutenção e servir de guia para os usuários finais.

---

## 7. Restrições Técnicas

### 7.1. Padrões Aplicáveis
O projeto, em linguagem **TypeScript** (compilada para JavaScript), deve seguir padrões de design responsivo, garantindo que o marketplace seja acessível e funcional tanto em desktops quanto em dispositivos móveis. Além disso, a implementação deve respeitar a acessibilidade digital, com uma interface simplificada para usuários com baixa familiaridade tecnológica.

### 7.2. Restrições Aplicáveis
* A implementação está restrita ao uso do **React.js** no front-end, **Node.js** com framework **Express** no back-end e **MySQL** para a gestão do banco de dados relacional.
* Não é permitida a exigência de instalação de dependências ou softwares adicionais no hardware do usuário final.

---

## 8. Manual de Arquitetura

### 8.1. Visão de Implementação
O sistema adota uma arquitetura desacoplada baseada em **API RESTful**, onde o front-end atua como uma *Single Page Application* (**SPA**) que consome serviços de back-end. A comunicação é feita via protocolo **HTTP/HTTPS**, utilizando **JSON** para intercâmbio de dados. Esta estrutura permite uma manutenção simplificada e garante que a lógica de negócio seja processada de forma independente da interface.

### 8.2. Mecanismos Arquiteturais

| Mecanismo de Análise | Mecanismo de Design | Mecanismos de Implementação |
| :--- | :--- | :--- |
| **Persistência** | Banco de Dados Relacional | MySQL |
| **Interface de Usuário** | SPA (Single Page Application) | React.js com TypeScript e Vite |
| **Processamento Server-side** | API REST | Node.js / Express com TypeScript |
| **Versionamento** | Controle de Versão | Git / GitHub |
