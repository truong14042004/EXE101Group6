import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

// Load .env.local file
config({ path: ".env.local" })

const {
  DB_HOST = "localhost",
  DB_PORT = "5432",
  DB_USER = "postgres",
  DB_PASSWORD,
  DB_NAME = "ai_job_prep",
} = process.env

if (!DB_PASSWORD) {
  throw new Error("DB_PASSWORD is required in .env.local")
}

const DATABASE_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
})
