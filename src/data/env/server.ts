import { createEnv } from "@t3-oss/env-nextjs"
import z from "zod"

export const env = createEnv({
  server: {
    // For production (Vercel + Neon), use POSTGRES_URL or DATABASE_URL
    DATABASE_URL: z.string().url().optional(),
    POSTGRES_URL: z.string().url().optional(),
    // For local development, use individual DB variables
    DB_PASSWORD: z.string().min(1).optional(),
    DB_HOST: z.string().min(1).optional(),
    DB_PORT: z.string().min(1).optional(),
    DB_USER: z.string().min(1).optional(),
    DB_NAME: z.string().min(1).optional(),
    ARCJET_KEY: z.string().min(1).optional(),
    CLERK_SECRET_KEY: z.string().min(1).optional(),
    HUME_API_KEY: z.string().min(1).optional(),
    HUME_SECRET_KEY: z.string().min(1).optional(),
    GEMINI_API_KEY: z.string().min(1).optional(),
  },
  createFinalSchema: env => {
    return z.object(env).transform(val => {
      const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, DATABASE_URL, POSTGRES_URL, ...rest } = val
      
      // Use POSTGRES_URL (Vercel Neon), DATABASE_URL, or build from parts (local)
      const finalDatabaseUrl = POSTGRES_URL || DATABASE_URL || 
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
      
      return {
        ...rest,
        DATABASE_URL: finalDatabaseUrl,
        ARCJET_KEY: val.ARCJET_KEY!,
        CLERK_SECRET_KEY: val.CLERK_SECRET_KEY!,
        HUME_API_KEY: val.HUME_API_KEY,
        HUME_SECRET_KEY: val.HUME_SECRET_KEY,
        GEMINI_API_KEY: val.GEMINI_API_KEY!,
      }
    })
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
})
