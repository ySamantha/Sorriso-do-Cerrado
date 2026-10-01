CREATE TABLE `banners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(100),
	`imagemURL` varchar(255) NOT NULL,
	`link` varchar(255),
	`ativo` boolean DEFAULT true,
	`ordem` int DEFAULT 0,
	CONSTRAINT `banners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favoritos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_usuario` int NOT NULL,
	`id_produto` int NOT NULL,
	`data` datetime DEFAULT '2026-09-20 19:48:55.856',
	CONSTRAINT `favoritos_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_fav` UNIQUE(`id_usuario`,`id_produto`)
);
--> statement-breakpoint
CREATE TABLE `itens_venda` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_venda` int NOT NULL,
	`id_produto` int NOT NULL,
	`quantidade` int NOT NULL,
	`preco_unitario` decimal(10,2) NOT NULL,
	CONSTRAINT `itens_venda_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `produtos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`descricao` text,
	`preco` decimal(10,2) NOT NULL,
	`estoque` int DEFAULT 0,
	`imagemURL` varchar(255),
	CONSTRAINT `produtos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`senha` varchar(255) NOT NULL,
	`papel` enum('admin','artesa','cliente') DEFAULT 'cliente',
	CONSTRAINT `usuarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `usuarios_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vendas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome_cliente` varchar(100) NOT NULL,
	`email_cliente` varchar(100),
	`telefone_cliente` varchar(20),
	`data` datetime DEFAULT '2026-09-20 19:48:55.856',
	`total` decimal(10,2),
	`status` enum('pendente','confirmada','cancelada') DEFAULT 'pendente',
	CONSTRAINT `vendas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_id_usuario_usuarios_id_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_id_produto_produtos_id_fk` FOREIGN KEY (`id_produto`) REFERENCES `produtos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itens_venda` ADD CONSTRAINT `itens_venda_id_venda_vendas_id_fk` FOREIGN KEY (`id_venda`) REFERENCES `vendas`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itens_venda` ADD CONSTRAINT `itens_venda_id_produto_produtos_id_fk` FOREIGN KEY (`id_produto`) REFERENCES `produtos`(`id`) ON DELETE cascade ON UPDATE no action;