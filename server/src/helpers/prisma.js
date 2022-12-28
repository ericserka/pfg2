import { PrismaClient } from '@prisma/client'
import { shareLocationWithAllService } from '../services/groupsService.js'

export const prisma = new PrismaClient()

const playground = async () => {
  console.log(
    (
      await prisma.user.findUniqueOrThrow({
        where: { id: 1 },
        select: {
          _count: {
            select: { groups: true },
          },
        },
      })
    )._count.groups
  )
}

playground()
