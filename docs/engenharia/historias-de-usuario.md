# Histórias de Usuário (User Stories)

**Padrão:** *Como [papel], eu quero [ação] para que [benefício / valor de negócio].*  
**Escopo:** Marketplace colaborativo Sorriso do Cerrado (Versão 2.0 / 3.0 — consolidando as histórias originais da v1.0 e os novos fluxos multi-artesãos de 2026/2).

---

## 1. Módulo de Autenticação e Perfil

### HU01 — Login no Sistema
* **Descrição:** Como usuário (cliente, artesão ou administrador), eu quero realizar login utilizando meu e-mail e senha cadastrados para acessar as funcionalidades correspondentes ao meu papel.
* **Critérios de Aceitação:**
    * Validar o preenchimento obrigatório de e-mail e senha.
    * Bloquear o acesso de contas desativadas ou excluídas logicamente (HTTP 403 — *"Esta conta está desativada"*).
    * Criar sessão persistida na tabela `session` via Better Auth e retornar cookie HTTP seguro.
    * Exibir no menu o painel compatível com o papel do usuário (`artisan` → `/admin`; `admin`/`super_admin` → `/painel-administrativo`).

### HU02 — Cadastro de Conta de Cliente
* **Descrição:** Como novo visitante, eu quero criar uma conta informando nome, e-mail e senha forte para poder favoritar produtos, conversar com lojas e finalizar compras.
* **Critérios de Aceitação:**
    * Validar força mínima da senha (8+ caracteres, maiúscula, minúscula, número e caractere especial) e confirmação.
    * Impedir cadastro de e-mail duplicado no banco de dados.
    * Criar conta com papel padrão `cliente` e senha armazenada em hash seguro.

### HU03 — Perfil Unificado do Usuário
* **Descrição:** Como usuário autenticado, eu quero acessar minha página de perfil unificada para editar meus dados pessoais, alterar minha senha, gerenciar meus favoritos e consultar meu histórico de pedidos recentes.
* **Critérios de Aceitação:**
    * Permitir atualização de nome, foto e e-mail respeitando unicidade.
    * Permitir troca segura de senha exigindo a senha atual.
    * Listar pedidos recentes vinculados à conta com status de pagamento.

---

## 2. Módulo de Vitrine, Catálogo e Lojas Públicas

### HU04 — Visualização do Catálogo e Página Explorar
* **Descrição:** Como consumidor, eu quero explorar a página inicial e o catálogo com artesãos em destaque, categorias e produtos populares para descobrir peças artesanais da região.
* **Critérios de Aceitação:**
    * Exibir banners promocionais ativos, cards de artesãos em destaque e grade responsiva de produtos com foto, nome, loja e preço em Real (`R$`).

### HU05 — Pesquisa, Filtros e Ordenação de Produtos
* **Descrição:** Como cliente, eu quero pesquisar por termo (nome, categoria ou artesão), filtrar por categoria/faixa de preço e ordenar os resultados para encontrar rapidamente o artesanato desejado.
* **Critérios de Aceitação:**
    * Validar parâmetros no back-end (`GET /produtos`).
    * Suportar ordenação por recentes, antigos, menor preço e maior preço.
    * Exibir mensagem amigável *"Nenhum produto encontrado"* quando não houver resultados.

### HU06 — Detalhes do Produto e Visita à Loja Pública do Artesão
* **Descrição:** Como cliente, eu quero abrir a página de detalhes de uma peça e visitar a loja pública do artesão responsável para conhecer sua história, prazo de produção, envio e demais peças disponíveis.
* **Critérios de Aceitação:**
    * Exibir foto ampliada, descrição completa, estoque, preço e link direto para a loja do artesão.
    * Na loja pública (`/artesaos/:id`), exibir capa, logo, descrição, informações de envio/produção, botão de enviar mensagem e catálogo exclusivo daquele artesão.

### HU07 — Favoritar Produto
* **Descrição:** Como cliente autenticado, eu quero favoritar e desfavoritar peças artesanais para montar minha lista pessoal de desejos persistida no banco.
* **Critérios de Aceitação:**
    * Redirecionar visitantes não logados para a tela de login.
    * Alternar o estado do favorito e manter a lista sincronizada em novos logins.

---

## 3. Módulo de Carrinho e Checkout Pix (AbacatePay)

### HU08 — Gerenciar Carrinho de Compras
* **Descrição:** Como cliente, eu quero adicionar peças ao carrinho, alterar quantidades e remover itens para organizar minha compra antes do pagamento.
* **Critérios de Aceitação:**
    * Incrementar quantidade ao adicionar item repetido, recalcular o valor total dinamicamente e exibir estado *"Carrinho Vazio"* quando sem itens.

### HU09 — Finalizar Compra via Pix com Split Automático
* **Descrição:** Como cliente autenticado, eu quero finalizar minha compra com pagamento via QR Code Pix para pagar itens de um ou mais artesãos em uma única transação segura.
* **Critérios de Aceitação:**
    * Recalcular preços no back-end a partir do banco de dados.
    * Garantir a subconta AbacatePay de cada artesão envolvido e calcular os repasses descontando a comissão da plataforma.
    * Exibir QR Code e código Pix copia-e-cola com validade de 15 minutos e atualização periódica de status (a cada 5s).
    * Confirmar a venda automaticamente via webhook assinado (HMAC-SHA256) com controle de idempotência.

---

## 4. Módulo de Comunicação (Mensageria)

### HU10 — Enviar Mensagem Direta para a Loja
* **Descrição:** Como cliente autenticado, eu quero clicar em *"Enviar mensagem para a loja"* e conversar diretamente com o artesão pela Central de Mensagens para tirar dúvidas sobre peças ou encomendas.
* **Critérios de Aceitação:**
    * Reutilizar a conversa única existente para o par `(cliente, artesão)` ou iniciar nova conversa automaticamente.
    * Impedir envio de mensagem para a própria loja e rejeitar textos vazios ou acima de 5.000 caracteres.
    * Exibir contagem de mensagens não lidas e marcar como lidas ao abrir a conversa.

---

## 5. Módulo do Artesão (Vendedor)

### HU11 — Cadastrar Perfil Profissional de Artesão ("Quero Vender")
* **Descrição:** Como cliente, eu quero preencher o formulário de cadastro de artesão com meus dados pessoais, endereço, apresentação da loja e dados de recebimento para me tornar vendedor na plataforma.
* **Critérios de Aceitação:**
    * Validar CPF/CNPJ, CEP e chave Pix/dados bancários no servidor.
    * Cifrar os dados sensíveis com **AES-256-GCM** antes de gravar no banco.
    * Promover o papel da conta para `artisan` e provisionar a subconta na AbacatePay.

### HU12 — Gerenciar Catálogo Próprio (CRUD Isolado)
* **Descrição:** Como artesão autenticado, eu quero adicionar, editar e excluir produtos da minha loja no Painel do Artesão para manter meu catálogo e estoque atualizados.
* **Critérios de Aceitação:**
    * Permitir upload de imagem do produto (`/upload`) e vínculo automático ao `id_usuario` do artesão.
    * Garantir isolamento: um artesão só pode editar ou excluir produtos de sua própria autoria.

### HU13 — Configurar Loja Pública e Dados de Recebimento
* **Descrição:** Como artesão, eu quero personalizar logo, capa, nome público, descrição, prazo de produção e dados bancários/Pix da minha loja para apresentar meu trabalho profissionalmente e receber meus pagamentos.
* **Critérios de Aceitação:**
    * Persistir configurações públicas e cifrar dados financeiros atualizados com feedback visual imediato.

### HU14 — Acompanhar Resumo, Pedidos, Saldo e Solicitar Saques
* **Descrição:** Como artesão, eu quero visualizar na aba Resumo minhas métricas de vendas, pedidos recebidos, saldo disponível/bloqueado na subconta AbacatePay e solicitar saques para minha conta.
* **Critérios de Aceitação:**
    * Exibir resumo de vendas no mês, produtos ativos, mensagens não lidas, gráfico de faturamento e lista de pedidos com valor de repasse.
    * Validar valor mínimo de saque (`R$ 3,50`) e saldo disponível antes de registrar a transferência na AbacatePay.
    * Atualizar o status do saque (`concluido` ou `falhou`) via webhook assinado.

---

## 6. Módulo Administrativo (`admin` e `super_admin`)

### HU15 — Gerenciar Banners e Contas de Usuários
* **Descrição:** Como administrador, eu quero gerenciar os banners da página inicial (até 10 banners), acompanhar indicadores globais e consultar/editar contas de clientes e artesãos para manter a operação organizada.
* **Critérios de Aceitação:**
    * Restringir o acesso ao `/painel-administrativo` apenas a perfis `admin` e `super_admin`.
    * Permitir criação, edição, ordenação, ativação/desativação e remoção de banners.

### HU16 — Gerenciar Administradores e Desativação Lógica (Super Admin)
* **Descrição:** Como Super Admin, eu quero criar/gerenciar contas administrativas e desativar contas de usuários por exclusão lógica com trilha de auditoria para manter governança e integridade histórica.
* **Critérios de Aceitação:**
    * Exigir confirmação explícita na desativação e bloquear autoexclusão ou exclusão indevida de administradores.
    * Executar em transação: marcar `is_active = false` e `deleted_at`, encerrar todas as sessões ativas do alvo e gravar registro em `admin_audit_logs`.
