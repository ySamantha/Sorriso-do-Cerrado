CREATE DATABASE sorrisodb;
USE sorrisodb;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    papel ENUM('admin', 'artesa') DEFAULT 'artesa'
);

INSERT INTO usuarios (nome, email, senha, papel) VALUES (
  'Admin',
  'admin@email.com',
  '$2b$10$HahQ22BGzykXlrD/G0rAz.ox.8daO0RAr/I9t5pG8htpCyE1EM5eK',
  'admin'
);

/*"email": "admin@email.com",
"senha": "admin123"*/

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT DEFAULT 0,
    imagemURL VARCHAR(255)
);

CREATE TABLE vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(100),
    telefone_cliente VARCHAR(20),
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    status ENUM('pendente', 'confirmada', 'cancelada') DEFAULT 'pendente'
);

CREATE TABLE itens_venda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venda INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venda) REFERENCES vendas(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

