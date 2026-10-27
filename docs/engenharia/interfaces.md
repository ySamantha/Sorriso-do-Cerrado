# Design de Interface e Usabilidade

**Versão:** 1.1  
**Data:** 08/04/2026  
**Documento Base:** Documento de Interface e Prototipação (v1.1)

---

## 1. Identidade Visual e Conceito

A identidade visual do **Sorriso do Cerrado** foi inspirada na riqueza e na autenticidade do cerrado brasileiro, bem como nas matérias-primas tradicionais do artesanato local (capim dourado, sementes, palha, barro e fibras naturais).

* **Paleta de Cores:**
    * **Tons Terrosos e Terracota:** Representam a terra e a cerâmica regional, trazendo aconchego e autenticidade.
    * **Âmbar e Dourado:** Evocam o brilho do capim dourado e a luz solar do Cerrado.
    * **Neutros Claros (Off-white / Bege suave):** Fundos limpos que proporcionam excelente contraste e não cansam a visão durante a leitura.
    * **Verde Folha:** Utilizado em botões de sucesso, compra e contato direto via WhatsApp.

---

## 2. Padrões de Layout Adotados

### 2.1 Design Responsivo
Toda a interface foi estruturada com *media queries* e unidades relativas (`rem`, `%`, `vw`), adaptando-se sem quebra de conteúdo tanto a telas pequenas de smartphones quanto a monitores widescreen.

### 2.2 Hero Banner
A página inicial conta com um banner de topo (*Hero Banner*) de alto impacto visual, destacando a frase de boas-vindas da marca, imagens das peças mais emblemáticas e um botão direto para visualização do catálogo.

### 2.3 Layout em Grade (Grid Layout) e Cards de Produto
No catálogo e na vitrine, as peças são dispostas em uma grade harmoniosa. Cada peça é emoldurada por um **Card** com:
* Borda sutilmente arredondada e sombra suave (*box-shadow*).
* Efeito de elevação (*hover lift*) ao passar o cursor.
* Fotografia nítida do produto com proporção consistente.
* Título legível, valor em destaque e ícone para favoritar.

### 2.4 Navegação Fixa Superior (Navbar)
O cabeçalho superior permanece acessível durante a rolagem da página, contendo o logotipo da marca, os links principais (*Início*, *Catálogo*, *Sobre*), e atalhos rápidos com contadores para **Carrinho**, **Favoritos** e **Perfil/Painel Administrativo**.

---

## 3. Heurísticas de Usabilidade de Nielsen Aplicadas

| Heurística de Nielsen | Aplicação Prática no Sorriso do Cerrado |
| :--- | :--- |
| **1. Visibilidade do Estado do Sistema** | Contador dinâmico de itens no ícone do carrinho; avisos visuais de carregamento (*loading*) e confirmações em ações. |
| **2. Correspondência entre Sistema e Mundo Real** | Utilização de termos conhecidos do comércio tradicional (*Carrinho*, *Favoritos*, *Catálogo*) e ícones universalmente compreendidos. |
| **3. Controle e Liberdade do Usuário** | Facilidade para remover itens do carrinho a qualquer momento, alterar quantidades ou cancelar a edição de um produto. |
| **4. Consistência e Padronização** | Botões de ação primária seguem o mesmo padrão de cor e estilo em todas as páginas; tipografia padronizada em títulos e corpos de texto. |
| **5. Prevenção de Erros** | Confirmação explícita antes de excluir produtos no painel administrativo; validação de formato de e-mail no ato do preenchimento. |
| **6. Reconhecimento em vez de Memorização** | Exibição de foto e nome do produto no resumo do carrinho e nos detalhes; histórico de itens favoritados visível na página de favoritos. |
| **7. Flexibilidade e Eficiência de Uso** | Barra de busca rápida na navbar para clientes que já sabem o que procuram; navegação por cards para clientes exploratórios. |
| **8. Design Estético e Minimalista** | Telas despoluídas sem excesso de propaganda ou elementos visuais concorrentes, mantendo o foco total nas peças artesanais. |
| **9. Auxílio no Reconhecimento de Erros** | Mensagens claras em caso de senha incorreta ou campos vazios, explicando objetivamente como corrigir o problema. |
| **10. Ajuda e Documentação** | Orientações de compra, instruções diretas na finalização via WhatsApp e documentação completa de engenharia disponibilizada. |
