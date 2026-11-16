CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`product_name` text NOT NULL,
	`unit_price_jpy` integer NOT NULL,
	`price_type` text NOT NULL,
	`weight_grams` integer NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `order_items_order_id_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`customer_name` text NOT NULL,
	`instagram_handle` text NOT NULL,
	`note` text,
	`shipping_region_id` integer NOT NULL,
	`domestic_shipping_jpy` integer NOT NULL,
	`service_fee_jpy` integer NOT NULL,
	`international_shipping_jpy` integer,
	`brl_cents_per_hundred_jpy` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`shipping_region_id`) REFERENCES `shipping_regions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_code_unique` ON `orders` (`code`);