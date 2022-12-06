import { config } from 'dotenv'
import { StatusCodes } from 'http-status-codes'

config({ path: '../../.env' })

export const JWT_SECRET = process.env.JWT_SECRET
export const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002'
export const PRISMA_RECORD_NOT_FOUND_ERROR = 'P2025'
export const PRISMA_QUERY_INTERPRETATION_ERROR = 'P2016'
export const DEFAULT_ERROR_MESSAGE =
  'Servidor com instabilidade momentânea. Tente novamente mais tarde.'
export const DEFAULT_ERROR_STATUS_CODE = StatusCodes.INTERNAL_SERVER_ERROR
