ALTER TABLE `orders` ADD `user_id` integer REFERENCES users(id) ON DELETE set null;--> statement-breakpoint
CREATE INDEX `orders_user_id_idx` ON `orders` (`user_id`);--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'customer' NOT NULL;--> statement-breakpoint
-- Até aqui a tabela só tinha quem acessa o painel: essas contas continuam sendo de administração.
UPDATE `users` SET `role` = 'admin';
