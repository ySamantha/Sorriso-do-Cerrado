# Requisitos de Software (v3.0)

**Versão:** 3.0  
**Data:** 20/10/2026  
**Documento Base:** Documento de Requisitos de Software e Especificação de Casos de Uso (v3.0)  
**Orientador:** Prof. Diego Dias Rodrigues — Universidade Católica de Brasília (UCB)

[:material-file-pdf-box: Baixar Documento de Requisitos v3.0 (PDF)](../assets/v2/documentos/Documento_de_Requisitos_e_Casos_de_Uso_-_v3.0.pdf){ .md-button .md-button--primary }
[:material-file-word-box: Baixar Versão 3.0 Editável (DOCX)](../assets/v2/documentos/Documento_de_Requisitos_e_Casos_de_Uso_-_v3.0.docx){ .md-button }

---

## 1. Requisitos Funcionais (RF)

Os requisitos funcionais do **Sorriso do Cerrado v3.0** organizam-se em três módulos principais correspondentes aos perfis operacionais do marketplace.

### 1.1 Módulo do Artesão

| Código | Descrição | Prioridade |
| :---: | :--- | :---: |
| **RF001** | Permitir que usuários cadastrados realizem login com e-mail e senha para acessar as funções correspondentes ao seu perfil. | Crítica |
| **RF002** | Permitir que artesãos autenticados cadastrem novos produtos vinculados à sua própria loja, informando nome, descrição, categoria, preço, quantidade em estoque e imagem. | Crítica |
| **RF003** | Oferecer manutenção completa do catálogo por operações CRUD, permitindo edição e exclusão de produtos diretamente no banco MySQL, respeitando o isolamento entre artesãos. | Crítica |
| **RF004** | Exibir no painel do artesão a listagem de seus itens e pedidos recebidos para conferência e acompanhamento. | Crítica |
| **RF011** | Permitir o cadastro profissional como artesão, a personalização da página pública da loja (nome público, descrição, logo e capa) e o gerenciamento dos dados de recebimento integrados à AbacatePay. | Crítica |
| **RF012** | Disponibilizar no painel do artesão uma aba de **Resumo** com indicadores de vendas no mês, produtos ativos, mensagens não lidas, saldo AbacatePay e gráfico de vendas ao longo do tempo. | Importante |

### 1.2 Módulo do Cliente

| Código | Descrição | Prioridade |
| :---: | :--- | :---: |
| **RF005** | Exibir na página inicial os banners promocionais e os produtos em destaque para atrair o interesse do consumidor. | Crítica |
| **RF006** | Permitir ao usuário explorar todos os itens disponíveis e acessar as páginas públicas das lojas de cada artesão. | Crítica |
| **RF007** | Disponibilizar busca e filtragem no catálogo para localizar produtos por termo, categoria, preço ou ordenação. | Importante |
| **RF008** | Permitir ao cliente adicionar produtos ao carrinho, alterar quantidades, remover itens e salvar produtos em sua lista de favoritos persistida no banco. | Crítica |
| **RF009** | Calcular automaticamente o valor total dos itens selecionados no carrinho de compras. | Crítica |
| **RF010** | Disponibilizar página de detalhes para cada produto exibindo nome, descrição, preço, estoque disponível, imagem ampliada e acesso direto à loja do artesão. | Crítica |
| **RF014** | Permitir o checkout integrado ao gateway **AbacatePay**, validando o pedido e calculando automaticamente os repasses (*split*) para cada artesão envolvido na compra. | Crítica |
| **RF015** | Oferecer uma **Central de Mensagens** que permita a troca direta de mensagens entre clientes, lojas e outros artesãos. | Importante |
| **RF016** | Disponibilizar uma página de **Perfil unificada** para edição de dados pessoais, alteração de senha, foto de perfil, favoritos e histórico de pedidos. | Importante |

### 1.3 Módulo do Administrador

| Código | Descrição | Prioridade |
| :---: | :--- | :---: |
| **RF013** | Garantir acesso exclusivo ao **Painel Administrativo** para gerenciar banners promocionais exibidos na página inicial (criação, edição, ordenação e ativação), moderar contas de usuários e lojas de artesãos cadastradas, gerenciar administradores (`super_admin`) e acompanhar indicadores globais e registros de auditoria (`admin_audit_logs`). | Crítica |

---

## 2. Requisitos Não Funcionais (RNF)

| Código | Categoria | Descrição |
| :---: | :--- | :--- |
| **RNF001** | Usabilidade e Acessibilidade | A interface deve ser altamente intuitiva e simplificada para que usuários com baixa familiaridade tecnológica operem o sistema sem auxílio externo. |
| **RNF002** | Usabilidade e Acessibilidade | O layout deve ser totalmente responsivo, garantindo funcionamento correto em desktops, tablets e smartphones. |
| **RNF003** | Desempenho | O front-end deve funcionar como uma Single Page Application (SPA) em React, minimizando o tempo de carregamento de páginas. |
| **RNF004** | Desempenho / Compatibilidade | O sistema deve ser totalmente compatível com os navegadores Google Chrome e Microsoft Edge. |
| **RNF005** | Desempenho | As páginas (vitrine, detalhes do produto e carrinho) devem ser carregadas em no máximo 2 a 3 segundos em condições normais de conectividade. |
| **RNF006** | Desempenho / Escalabilidade | A arquitetura do banco MySQL e das APIs em Node.js deve suportar o crescimento do volume de produtos sem degradação de performance ou interrupção dos serviços. |
| **RNF007** | Segurança e Confiabilidade | Toda alteração no estoque ou no cadastro de produtos deve ser refletida de forma íntegra no banco de dados MySQL. |
| **RNF008** | Segurança e Confiabilidade | As rotas de cadastro, edição, moderação e recebimentos devem ser protegidas, bloqueando acessos que não possuam sessão e papel válidos. |
| **RNF009** | Disponibilidade | O sistema deve ser projetado para operar com alta disponibilidade (99,8% a 99,98% em ambiente de produção), minimizando períodos de inatividade. |
| **RNF010** | Suportabilidade | O sistema deve rodar integralmente nos principais navegadores sem exigir a instalação de softwares adicionais no dispositivo do usuário final. |
| **RNF011** | Documentação | Deverá ser elaborada documentação técnica completa e manual do usuário para facilitar a manutenção futura e orientar artesãos e administradores. |

---

## 3. Rastreabilidade com Casos de Uso

Para o detalhamento completo dos fluxos principais, alternativos e de exceção que realizam estes requisitos, consulte a página [Especificação de Casos de Uso](casos-de-uso.md) e os [Diagramas de Atividades](../diagramas/atividades.md).
