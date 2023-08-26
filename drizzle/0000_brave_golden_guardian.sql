DO $$ BEGIN
 CREATE TYPE "housing_developer_role" AS ENUM('admin', 'staff', 'customer_service');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_type" AS ENUM('resident', 'housing_developer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "housing_developer_accounts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"role" "housing_developer_role",
	"user_id" varchar NOT NULL,
	"housing_developer_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "housing_developers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "housing_developers_name_unique" UNIQUE("name"),
	CONSTRAINT "housing_developers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "housing_fee_bills" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"housing_fee_id" bigint NOT NULL,
	"amount" bigint NOT NULL,
	"due_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "housing_fee_payments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"housing_fee_bill_id" bigint NOT NULL,
	"payment_gateway_response" json NOT NULL,
	"payment_gateway_callback_response" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp,
	"expired_at" timestamp,
	CONSTRAINT "housing_fee_payments_housing_fee_bill_id_unique" UNIQUE("housing_fee_bill_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "housing_fees" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"housing_id" bigint NOT NULL,
	"predecessor_housing_fee_id" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "housing_ownerships" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"housing_id" bigint NOT NULL,
	"housing_developer_account_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "housings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"address" text NOT NULL,
	"housing_developer_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "housings_slug_unique" UNIQUE("slug"),
	CONSTRAINT "housings_name_housing_developer_id_unique" UNIQUE("name","housing_developer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"housing_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp,
	CONSTRAINT "properties_slug_housing_id_unique" UNIQUE("slug","housing_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resident_accounts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"housing_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "resident_accounts_user_id_housing_id_unique" UNIQUE("user_id","housing_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_keys" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"hashed_password" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"avatar" text,
	"type" "user_type" NOT NULL,
	"verified_at" timestamp,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property_occupancies" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"property_id" bigint NOT NULL,
	"resident_account_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "housing_developer_accounts" ADD CONSTRAINT "housing_developer_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "housing_developer_accounts" ADD CONSTRAINT "housing_developer_accounts_housing_developer_id_housing_developers_id_fk" FOREIGN KEY ("housing_developer_id") REFERENCES "housing_developers"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "housing_fee_bills" ADD CONSTRAINT "housing_fee_bills_housing_fee_id_housing_fees_id_fk" FOREIGN KEY ("housing_fee_id") REFERENCES "housing_fees"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "housing_fee_payments" ADD CONSTRAINT "housing_fee_payments_housing_fee_bill_id_housing_fee_bills_id_fk" FOREIGN KEY ("housing_fee_bill_id") REFERENCES "housing_fee_bills"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "housing_fees" ADD CONSTRAINT "housing_fees_housing_id_housings_id_fk" FOREIGN KEY ("housing_id") REFERENCES "housings"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "housing_ownerships" ADD CONSTRAINT "housing_ownerships_housing_id_housings_id_fk" FOREIGN KEY ("housing_id") REFERENCES "housings"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "housing_ownerships" ADD CONSTRAINT "housing_ownerships_housing_developer_account_id_housing_developer_accounts_id_fk" FOREIGN KEY ("housing_developer_account_id") REFERENCES "housing_developer_accounts"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "housings" ADD CONSTRAINT "housings_housing_developer_id_housing_developers_id_fk" FOREIGN KEY ("housing_developer_id") REFERENCES "housing_developers"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "properties" ADD CONSTRAINT "properties_housing_id_housings_id_fk" FOREIGN KEY ("housing_id") REFERENCES "housings"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resident_accounts" ADD CONSTRAINT "resident_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resident_accounts" ADD CONSTRAINT "resident_accounts_housing_id_housings_id_fk" FOREIGN KEY ("housing_id") REFERENCES "housings"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_keys" ADD CONSTRAINT "user_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property_occupancies" ADD CONSTRAINT "property_occupancies_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property_occupancies" ADD CONSTRAINT "property_occupancies_resident_account_id_resident_accounts_id_fk" FOREIGN KEY ("resident_account_id") REFERENCES "resident_accounts"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
