CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(150) NOT NULL,
	"username" varchar(100) NOT NULL UNIQUE,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'clerk' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

INSERT INTO "users" ("name", "username", "email", "password", "role", "status")
VALUES ('Admin User', 'admin', 'admin@djackman.com', '$2a$10$nLMdtNrksqb8LflUKdbqvOM5Cq5VoPnKmFSRhOHv35L6XCwk5hy0S', 'admin', 'active');
