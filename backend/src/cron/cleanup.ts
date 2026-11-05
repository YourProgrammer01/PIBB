import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../config/prisma'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { count } = await prisma.refreshToken.deleteMany({
      where: { OR: [{ revoked: true }, { expiresAt: { lt: new Date() } }] },
    })
    res.json({ deleted: count })
  } catch {
    res.status(500).json({ error: 'Cleanup failed' })
  }
}
