CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`position` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `kit_items` (
	`kit_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`step_label` text NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`kit_id`, `product_id`),
	FOREIGN KEY (`kit_id`) REFERENCES `kits`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`position` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kits_slug_unique` ON `kits` (`slug`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`description_pt` text NOT NULL,
	`description_en` text NOT NULL,
	`price_jpy` integer NOT NULL,
	`price_type` text NOT NULL,
	`weight_grams` integer NOT NULL,
	`is_limited_edition` integer DEFAULT false NOT NULL,
	`image` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_category_id_idx` ON `products` (`category_id`);--> statement-breakpoint
CREATE TABLE `shipping_rates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`region_id` integer NOT NULL,
	`max_weight_grams` integer NOT NULL,
	`price_jpy` integer NOT NULL,
	FOREIGN KEY (`region_id`) REFERENCES `shipping_regions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shipping_rates_region_weight_idx` ON `shipping_rates` (`region_id`,`max_weight_grams`);--> statement-breakpoint
CREATE TABLE `shipping_regions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`position` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shipping_regions_code_unique` ON `shipping_regions` (`code`);--> statement-breakpoint
CREATE TABLE `store_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`domestic_shipping_jpy` integer NOT NULL,
	`service_fee_jpy` integer NOT NULL,
	`brl_cents_per_hundred_jpy` integer NOT NULL,
	`updated_at` integer NOT NULL
);
