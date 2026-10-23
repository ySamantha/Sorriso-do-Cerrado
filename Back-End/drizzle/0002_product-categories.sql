CREATE TABLE `categorias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	CONSTRAINT `categorias_id` PRIMARY KEY(`id`),
	CONSTRAINT `categorias_nome_unique` UNIQUE(`nome`)
);
--> statement-breakpoint
ALTER TABLE `favoritos` MODIFY COLUMN `data` datetime DEFAULT '2026-10-23 01:39:54.954';--> statement-breakpoint
ALTER TABLE `vendas` MODIFY COLUMN `data` datetime DEFAULT '2026-10-23 01:39:54.954';--> statement-breakpoint
ALTER TABLE `produtos` ADD `id_categoria` int;--> statement-breakpoint
ALTER TABLE `produtos` ADD CONSTRAINT `produtos_id_categoria_categorias_id_fk` FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id`) ON DELETE set null ON UPDATE no action;