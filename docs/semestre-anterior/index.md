# Material do Semestre Anterior

!!! info "Acervo Histórico — Semestre Anterior (Versão 1.0)"
    Esta seção reúne integralmente todos os documentos, especificações, diagramas, protótipos, telas, relatórios de testes e arquivos editáveis produzidos no **semestre anterior**, quando o **Sorriso do Cerrado** foi concebido e entregue em sua **Versão 1.0** como uma vitrine virtual monoprodutor dedicada à artesã Dona Ângela (com Express, JWT e finalização via WhatsApp).

    Todos os materiais desta aba são preservados para fins de rastreabilidade histórica e evolução arquitetural, conforme as diretrizes da disciplina **Soluções Computacionais — 2026/2**.

---

## Comparativo de Evolução entre os Semestres

| Dimensão | Semestre Anterior (Versão 1.0) | Semestre Atual — 2026/2 (Versão 2.0 / 3.0) |
| :--- | :--- | :--- |
| **Modelo de Negócio** | Vitrine virtual monoprodutor (1 artesã) | Marketplace colaborativo multi-artesãos com lojas públicas individuais |
| **Back-End** | Node.js + Express | Node.js 22 + Fastify 5 + TypeScript (`tsx`) |
| **Autenticação** | JWT em `localStorage` | Better Auth com sessões no MySQL, cookies HTTP e papéis (`cliente`, `artisan`, `admin`, `super_admin`) |
| **Pagamentos** | Intenção de compra via WhatsApp | Checkout Pix transparente via **AbacatePay API v2** com subcontas, split automático, webhooks HMAC e saques |
| **Comunicação** | Link externo para WhatsApp | Central de Mensagens interna entre clientes e lojas/artesãos (além de contato opcional) |
| **Proteção de Dados** | Hash de senha | Hash de senha + cifragem **AES-256-GCM** para CPF/CNPJ, endereço, chave Pix e dados bancários |
| **Governança** | Painel único de produtos | Painel do Artesão (Resumo, Produtos, Pedidos, Mensagens, Loja, Saques) + Painel Administrativo (`admin`/`super_admin`, auditoria e *soft delete*) |

---

## Índice do Acervo Arquivado

### Documentação Base (v1.0)
* [Visão Geral Original (Página Inicial v1.0)](visao-geral.md)
* [Central de Downloads do Semestre Anterior](downloads.md)

### Engenharia de Software (Semestre Anterior)
* [Documento de Visão (v1.0)](engenharia/visao.md)
* [Requisitos de Software (v2.0)](engenharia/requisitos.md)
* [Histórias de Usuário (v1.0)](engenharia/historias-de-usuario.md)
* [Especificação de Casos de Uso (v2.0)](engenharia/casos-de-uso.md)
* [Arquitetura de Software (v1.0)](engenharia/arquitetura.md)
* [Design de Interface e Usabilidade (v1.1)](engenharia/interfaces.md)

### Diagramas (Semestre Anterior)
* [Casos de Uso Geral (v1.0)](diagramas/casos-de-uso.md)
* [Fluxos de Navegação (v1.0)](diagramas/fluxos-de-navegacao.md)
* [Diagramas de Atividades (v1.0)](diagramas/atividades.md)
* [Classes e Sequência — Login JWT (v1.0)](diagramas/classes-e-sequencia.md)
* [Arquitetura, Pacotes e Implantação (v1.0)](diagramas/arquitetura.md)

### Protótipos & Telas (Semestre Anterior)
* [Protótipos de Alta Fidelidade (v1.0)](prototipos/mockups.md)
* [Telas Implementadas (v1.0)](prototipos/telas-implementadas.md)
