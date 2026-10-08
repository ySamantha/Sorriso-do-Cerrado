# Documento de Visão — Sorriso do Cerrado

**Versão:** 1.0  
**Data:** 14/03/2026  
**Autores:** Pedro Henrique Cavalcante de Sousa, Samantha Yumi Tanaka, Samuel Batista Rennó, Vinicios Trindade Costa, Wictor Emanoel Ponte Menezes.

---

## 1. Introdução

### 1.1 Finalidade
A finalidade deste documento é definir a visão estratégica do sistema **Sorriso do Cerrado**, estabelecendo os objetivos de negócio, o público-alvo, as necessidades prioritárias da artesã Ângela Maria e as fronteiras do produto de software a ser construído.

### 1.2 Escopo
O Sorriso do Cerrado é uma aplicação web de comércio eletrônico (*e-commerce*) especializada em artesanato regional. O escopo contempla:
* **Vitrine virtual interativa:** Exibição estruturada das peças artesanais com fotos, descrições detalhadas e preços.
* **Módulo do cliente:** Navegação no catálogo, busca textual, inclusão em favoritos e carrinho de compras interativo.
* **Módulo administrativo da artesã:** Autonomia para gerenciar o catálogo (cadastro, edição, remoção de produtos) e atualização de estoque.
* **Canal de finalização:** Integração do carrinho com registro da intenção de compra e contato direto via WhatsApp para fechamento do pagamento e entrega.

### 1.3 Definições, Acrônimos e Abreviações
* **ODS:** Objetivos de Desenvolvimento Sustentável (ONU).
* **CRUD:** *Create, Read, Update, Delete* (operações fundamentais em bancos de dados).
* **SPA:** *Single Page Application* (aplicação web de página única carregada dinamicamente).
* **API:** *Application Programming Interface* (Interface de Programação de Aplicações).
* **JWT:** *JSON Web Token* (padrão para transmissão segura de credenciais de autenticação).

---

## 2. Contextualização do Problema

| Dimensão | Descrição Detalhada |
| :--- | :--- |
| **O Problema** | Cerca de 25% dos microempreendedores brasileiros enfrentam severas barreiras de inclusão digital. A artesã Ângela Maria não dispunha de um canal digital estruturado para divulgar e comercializar suas peças. |
| **Pessoas Atingidas** | **Diretamente:** 1 artesã local.<br>**Indiretamente:** Estimativa de mais de 100 pessoas (potenciais clientes, comunidade local e cooperativas de artesanato). |
| **Impacto do Problema** | Baixa visibilidade comercial, dependência exclusiva de feiras pontuais e vendas informais, limitações na fonte de renda e dificuldade para expandir as vendas além da região imediata. |
| **Solução Proposta** | Aplicação web moderna, intuitiva e responsiva, permitindo que a artesã exponha seus produtos sem intermediários abusivos ou custos fixos de manutenção de loja física. |

---

## 3. Sentença de Posição do Produto

| Elemento | Declaração |
| :--- | :--- |
| **Para** | Artesãos locais, como a artesã Ângela Maria, que necessitam de autonomia digital. |
| **Que** | Buscam comercializar suas peças artesanais de forma autônoma na internet. |
| **O** | **Sorriso do Cerrado** é uma plataforma web de e-commerce e catálogo virtual. |
| **Diferente de** | *Marketplaces* genéricos e complexos (com taxas elevadas, interfaces sobrecarregadas e regras burocráticas). |
| **Nosso produto** | Proporciona uma interface acolhedora, simplificada, inclusiva e focada na identidade cultural do Cerrado, com controle direto sobre produtos e pedidos. |

---

## 4. Stakeholders e Perfis de Usuários

### 4.1 Principais Stakeholders
* **Administradora (Artesã Ângela Maria):** Responsável por alimentar o catálogo, cadastrar novas peças com fotos e preços, gerenciar quantidades e atender aos pedidos recebidos.
* **Clientes e Consumidores:** Pessoas interessadas em artesanato brasileiro sustentável, presentes criativos e decoração típica.
* **Equipe de Engenharia:** Samantha Tanaka, Vinicios Costa, Pedro Henrique Cavalcante, Pedro Henrique Nunes, Samuel Batista e Wictor Emanoel (desenvolvimento, garantia da qualidade e implantação).
* **Orientação Acadêmica:** Prof. Alexandre Silva dos Santos (acompanhamento e validação das entregas de Engenharia de Software).

### 4.2 Necessidades-Chave

| Nº | Necessidade do Usuário | Prioridade | Justificativa |
| :---: | :--- | :---: | :--- |
| 1 | Cadastrar e gerenciar produtos com fotos e preços | **Crítica** | Essencial para a autonomia comercial da artesã. |
| 2 | Disponibilizar catálogo digital acessível a clientes | **Crítica** | Permite que qualquer cliente navegue e descubra os produtos. |
| 3 | Carrinho de compras com cálculo automático de subtotais | **Crítica** | Concede uma experiência de compra moderna e confiável. |
| 4 | Área restrita para controle de estoque e edição rápida | **Crítica** | Garante que a artesã controle preços e disponibilidade. |
| 5 | Interface simplificada e intuitiva | **Importante** | Adequada ao perfil com baixa familiaridade com ferramentas digitais. |
| 6 | Lista de favoritos persistente | **Importante** | Permite que clientes salvem intenções futuras de compra. |
| 7 | Documentação técnica e manual de uso | **Útil** | Garante manutenibilidade e sustentabilidade do software a longo prazo. |

---

## 5. Estimativa de Custo e Infraestrutura

O projeto foi desenvolvido sob o escopo de extensão acadêmica sem fins lucrativos na Universidade Católica de Brasília, resultando em **custo de desenvolvimento financeiro nulo** para a artesã beneficiária.

Em termos de infraestrutura operacional:
* **Ambiente de Desenvolvimento:** Computadores pessoais da equipe, Git/GitHub, Docker Engine.
* **Ambiente de Produção (Alvo):** Servidores em nuvem de baixo custo / planos gratuitos para estudantes (Render/Railway/Vercel) e banco de dados relacional MySQL.
