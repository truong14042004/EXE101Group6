import { createEnv } from "@t3-oss/env-nextjs"
import z from "zod"

export const env = createEnv({
  server: {
    // For production (Vercel + Neon), use DATABASE_URL directly
    DATABASE_URL: z.string().url().optional(),
    // For local development, use individual DB variables
    DB_PASSWORD: z.string().min(1).optional(),
    DB_HOST: z.string().min(1).optional(),
    DB_PORT: z.string().min(1).optional(),
    DB_USER: z.string().min(1).optional(),
    DB_NAME: z.string().min(1).optional(),
    ARCJET_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    HUME_API_KEY: z.string().min(1).optional(),
    HUME_SECRET_KEY: z.string().min(1).optional(),
    GEMINI_API_KEY: z.string().min(1),
  },
  createFinalSchema: env => {
    return z.object(env).transform(val => {
      const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, DATABASE_URL, ...rest } = val
      
      // Use DATABASE_URL if provided (production), otherwise build from parts (local)
      const finalDatabaseUrl = DATABASE_URL || 
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
      
      return {
        ...rest,
        DATABASE_URL: finalDatabaseUrl,
      }
    })
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
})
