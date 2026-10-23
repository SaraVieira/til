CREATE TABLE "tils" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tils_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "tils_created_at_idx" ON "tils" USING btree ("created_at");