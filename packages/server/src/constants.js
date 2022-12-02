import { config } from 'dotenv'

config({ path: '../../.env' })

export const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002'
export const PRISMA_RECORD_NOT_FOUND_ERROR = 'P2025'
export const PRISMA_QUERY_INTERPRETATION_ERROR = 'P2016'
export const JWT_SECRET = process.env.JWT_SECRET
