ALTER TABLE "user" ALTER COLUMN "isAcceptingMessage" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "isAcceptingMessage" DROP NOT NULL;