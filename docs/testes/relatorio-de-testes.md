# Relatório de Execução e Defeitos

**Versão:** 1.0  
**Data:** 19/05/2026  
**Autores:** Pedro Henrique Cavalcante, Samantha Yumi Tanaka, Samuel Batista Rennó, Vinicios Trindade Costa, Wictor Emanoel Ponte Menezes.

---

## 1. Resumo Executivo das Execuções

Durante o ciclo oficial de garantia de qualidade do sistema Sorriso do Cerrado, foram executados **16 casos de teste** cobrindo testes unitários, testes de integração de API e testes de ponta a ponta (E2E).

| Nível de Teste | Total Executado | Aprovados | Reprovados | Taxa de Sucesso |
| :--- | :---: | :---: | :---: | :---: |
| **Unitários (Jest)** | 5 | 5 | 0 | **100%** |
| **API / Integração (Postman)** | 3 | 3 | 0 | **100%** |
| **End-to-End (Cypress)** | 4 | 4 | 0 | **100%** |
| **Exploratórios Manuais** | 4 | 4 | 0 | **100%** |
| **TOTAL CONSOLIDADO** | **16** | **16** | **0** | **100%** |

!!! success "Resultado dos Testes"
    Todos os testes automatizados e funcionais foram executados com **100% de sucesso**. O MVP apresentou estabilidade, integridade nas regras de negócio e proteção adequada em suas rotas autenticadas.

---

## 2. Matriz de Defeitos e Vulnerabilidades Mapeadas

A tabela a seguir consolida os apontamentos identificados na auditoria do sistema (`defeitos_sorriso_do_cerrado.csv`), com suas respectivas classificações e soluções:

| ID | Tipo de Teste | Status | Severidade | Observação e Ação de Correção |
| :---: | :--- | :---: | :---: | :--- |
| **CT 001** | Segurança | *Mitigado* | **Alta** | Tentativa de acesso indevido à rota administrativa sem token. Bloqueado com sucesso com 403 Forbidden após inserção de middleware. |
| **CT 002** | API / Caixa-Preta | Aprovado | - | Requisição a produto inexistente retornou 404 Not Found corretamente. |
| **CT 003** | Exploratório | Aprovado | - | Lista de favoritos permaneceu consistente e sincronizada após operações de remoção. |
| **CT 004** | API | Aprovado | - | Criação de banner com `multipart/form-data` e upload de imagem processado com sucesso. |
| **CT 005** | Segurança | Aprovado | - | Bloqueio de endpoints privados sem cabeçalho `Authorization` ou com token expirado. |
| **CT 006** | Autenticação | Aprovado | - | Persistência de sessão do usuário no `localStorage` recuperada após recarregar página. |
| **CT 007** | Unitário | Aprovado | - | Validação e rejeição de e-mails mal formatados via regex utilitário. |
| **CT 008** | Negócio | Aprovado | - | Bloqueio de produtos com preços negativos ou iguais a zero. |
| **CT 009** | Segurança API | Aprovado | - | Controle estrito de acesso por perfil (`isAdmin: true` vs. `isAdmin: false`). |
| **CT 010** | Funcional | Aprovado | - | Atualização cadastral respeitando unicidade de e-mail na base relacional. |
| **CT 011** | Funcional | Aprovado | - | Persistência de itens favoritos após deslogar e logar novamente. |
| **CT 012** | Funcional | Aprovado | - | Cálculo dinâmico do carrinho com múltiplos produtos e quantidades. |
| **CT 013** | E2E (Cypress) | Aprovado | - | Listagem de produtos via interface com elementos renderizados no DOM. |
| **CT 014** | E2E (Cypress) | Aprovado | - | Fluxo interativo de adição de itens ao carrinho via interface. |
| **CT 015** | Unitário (Jest)| Aprovado | - | Teste de incremento de quantidade ao adicionar mesmo item repetidas vezes. |
| **CT 016** | Unitário (Jest)| Aprovado | - | Validação da função utilitária de extração de privilégios de administrador via JWT. |

---

## 3. Lições Aprendidas e Conclusão

1. **Importância dos Testes Automatizados no Ciclo Acadêmico:** A escrita antecipada de testes unitários em Jest poupou tempo significativo na depuração de regras de cálculo do carrinho e validações de e-mail.
2. **Segurança em Camadas:** A proteção de rotas no front-end é importante para a experiência do usuário, mas a segurança real depende fundamentalmente da validação de tokens e permissões no back-end (Express/JWT).
3. **Foco no Usuário Real:** Os testes ponta a ponta com Cypress garantiram que a experiência da artesã e dos compradores ocorra de maneira fluida, sem bloqueios inesperados.
