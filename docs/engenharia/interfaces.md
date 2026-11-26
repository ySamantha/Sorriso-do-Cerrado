# Design de Interface e Usabilidade (v2.0)

**Versão:** 2.0 (Marketplace Multi-Artesãos)  
**Referências:** Protótipos atualizados do Marketplace (2026/2), Documento de Visão v2.1 e Documento de Interface e Prototipação v1.1 (acervo contínuo).

---

## 1. Identidade Visual e Conceito do Cerrado

A identidade visual do **Sorriso do Cerrado** mantém sua inspiração na autenticidade do Cerrado brasileiro e nas matérias-primas tradicionais do artesanato regional (capim dourado, cerâmica, barro, sementes, crochê e fibras naturais), expandida agora para abrigar múltiplas lojas artesanais em harmonia visual:

| Cor | Hexadecimal | Uso na Interface |
| :--- | :---: | :--- |
| **Creme Suave** | `#FAF3E0` | Fundo principal acolhedor com alto conforto de leitura |
| **Terracota** | `#8D5B4C` | Botões primários, títulos e elementos de identidade |
| **Terracota Escuro** | `#714A3E` | Estados *hover* e barras de navegação secundárias |
| **Marrom Terroso** | `#4A3B31` | Tipografia principal e rodapé institucional |
| **Sienna / Dourado** | `#A0522D` / `#D2B48C` | Links, destaques e detalhes inspirados no capim dourado |
| **Verde Sucesso** | `#2E7D32` | Confirmações de pagamento Pix, estoque e ações positivas |

---

## 2. Padrões de Layout do Marketplace (2026/2)

### 2.1 Página Explorar e Descoberta Multi-Artesãos
* **Busca Unificada no Topo:** barra central *"Buscar produto ou artesão"* acompanhada por pílulas rápidas de categoria (*Bolsas, Colares, Cachecóis, Cerâmica, Cestaria, Decoração*).
* **Cards de Artesãos em Destaque:** exibem capa personalizada, avatar/logo, nome da loja, cidade/estado, especialidade, avaliação e botão direto *"Visitar loja"*.
* **Grade de Produtos Populares:** cards com foto, título, vínculo *"por [Nome da Loja]"*, preço em destaque, botão de favoritar e *"Adicionar ao carrinho"*.

### 2.2 Página Pública da Loja do Artesão
* Cabeçalho com **imagem de capa**, **logo circular**, localização, descrição autoral e botões de ação (*Seguir loja* e *Enviar mensagem*).
* Organização em abas (*Produtos*, *Sobre*, *Avaliações*) com seletor de ordenação.
* Cartões laterais de **Informações da Loja** (envio, prazo de produção e pagamento) e atalho direto para a **Central de Mensagens** (*"Dúvidas? Enviar mensagem para a loja"*).

### 2.3 Painel do Vendedor e Configurações da Loja
* Navegação lateral limpa (*Resumo, Produtos, Pedidos, Mensagens, Configurações da loja*).
* **Resumo Executivo:** cards de métricas (*Vendas do mês, Pedidos novos, Produtos ativos*), saldo AbacatePay e tabela de pedidos recentes com *badges* coloridos de status (*Novo, Em preparo, Enviado*).
* **Configurações da Loja:** edição visual de logo, capa, nome, categoria principal, cidade/UF, WhatsApp, descrição, prazo de produção, envio e formas de pagamento.

### 2.4 Suporte a Tema Claro/Escuro e Responsividade
* Layout 100% responsivo em desktops, tablets e smartphones, com suporte a alternância de tema (`ThemeContext`) e notificações não intrusivas (`NotificacaoContext`).

---

## 3. Heurísticas de Usabilidade de Nielsen Aplicadas

| Heurística de Nielsen | Aplicação Prática no Marketplace Sorriso do Cerrado |
| :--- | :--- |
| **1. Visibilidade do Estado do Sistema** | Contador de itens no carrinho, contador de mensagens não lidas, status em tempo real do pagamento Pix (atualizado a cada 5s) e *badges* de status nos pedidos. |
| **2. Correspondência entre Sistema e Mundo Real** | Vocabulário acessível e familiar a artesãos com baixa familiaridade digital (*Minha loja, Pedidos recentes, Dados de recebimento, Favoritos*). |
| **3. Controle e Liberdade do Usuário** | Opção de descartar alterações em formulários, cancelar exclusões, ajustar carrinho livremente e navegar entre lojas e catálogo sem fricção. |
| **4. Consistência e Padronização** | Paleta terrosa uniforme, cabeçalho fixo padronizado em todas as rotas e componentes reutilizáveis de cards, filtros e formulários. |
| **5. Prevenção de Erros** | Validação de senha forte no cadastro, confirmação explícita antes de exclusões (produtos e contas) e bloqueio de envio de mensagens para a própria loja. |
| **6. Reconhecimento em vez de Memorização** | Resumo visual de fotos, lojas e quantidades no carrinho, histórico de pedidos no perfil e atalhos contextuais no painel. |
| **7. Flexibilidade e Eficiência de Uso** | Busca por termo/artesão, filtros combinados por categoria/preço/ordenação e acesso direto ao painel conforme o papel autenticado. |
| **8. Design Estético e Minimalista** | Telas limpas sobre fundo creme suave que destacam a fotografia das peças artesanais sem poluição visual. |
| **9. Auxílio no Reconhecimento de Erros** | Mensagens claras indicando campos inválidos (CPF/CNPJ, CEP, chave Pix, valor mínimo de saque de `R$ 3,50`, conta desativada). |
| **10. Ajuda e Documentação** | Orientações contextuais nos formulários de loja/recebimento, vídeo demonstrativo passo a passo e esta documentação completa. |

---

Para visualizar todas as telas e protótipos (novos e contínuos), acesse a aba [**Protótipos & Telas**](../prototipos/mockups.md).
