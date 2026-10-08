function adicionarAoCarrinho(carrinho, produto) {
  const itemExistente = carrinho.find(item => item.id === produto.id);

  if (itemExistente) {
    return carrinho.map(item =>
      item.id === produto.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...carrinho, { ...produto, quantity: 1 }];
}

test('CT002 - deve adicionar produto novo ao carrinho', () => {
  const carrinho = [];

  const produto = {
    id: 1,
    name: 'Produto Teste',
    price: 10
  };

  const resultado = adicionarAoCarrinho(carrinho, produto);

  expect(resultado.length).toBe(1);
  expect(resultado[0].quantity).toBe(1);
});

test('CT003 - deve aumentar quantidade se produto já existir', () => {
  const carrinho = [
    { id: 1, name: 'Produto Teste', price: 10, quantity: 1 }
  ];

  const produto = {
    id: 1,
    name: 'Produto Teste',
    price: 10
  };

  const resultado = adicionarAoCarrinho(carrinho, produto);

  expect(resultado[0].quantity).toBe(2);
});