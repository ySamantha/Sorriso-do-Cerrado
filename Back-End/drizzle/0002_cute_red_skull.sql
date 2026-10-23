CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` datetime NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`papel` enum('admin','artesa','cliente') DEFAULT 'cliente',
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
RENAME TABLE `usuarios` TO `account`;--> statement-breakpoint
ALTER TABLE `account` DROP INDEX `usuarios_email_unique`;--> statement-breakpoint
ALTER TABLE `favoritos` DROP FOREIGN KEY `favoritos_id_usuario_usuarios_id_fk`;
--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `favoritos` MODIFY COLUMN `id_usuario` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `favoritos` MODIFY COLUMN `data` datetime DEFAULT '2026-10-20 00:37:37.304';--> statement-breakpoint
ALTER TABLE `vendas` MODIFY COLUMN `data` datetime DEFAULT '2026-10-20 00:37:37.304';--> statement-breakpoint
ALTER TABLE `account` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `account` ADD `account_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `provider_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `user_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `access_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `refresh_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `id_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `access_token_expires_at` datetime;--> statement-breakpoint
ALTER TABLE `account` ADD `refresh_token_expires_at` datetime;--> statement-breakpoint
ALTER TABLE `account` ADD `scope` text;--> statement-breakpoint
ALTER TABLE `account` ADD `password` text;--> statement-breakpoint
ALTER TABLE `account` ADD `created_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `updated_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_id_usuario_user_id_fk` FOREIGN KEY (`id_usuario`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `nome`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `senha`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `papel`;