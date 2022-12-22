import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// const playground = async () => {
//   await prisma.group.delete({ where: { id: 8 } })
// }

// playground()
