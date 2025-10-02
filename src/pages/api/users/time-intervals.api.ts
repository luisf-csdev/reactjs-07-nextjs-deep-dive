import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const timeIntervalsBodySchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number(),
        startTimeInMinutes: z.number(),
        endTimeInMinutes: z.number(),
      }),
    )
    .min(1)
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        ),
      {
        error:
          'The end time must be at least one hour away from the start time.',
      },
    ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  await Promise.all(
    intervals.map((interval) =>
      prisma.userTimeInterval.create({
        data: {
          weekDay: interval.weekDay,
          timeEndInMinutes: interval.endTimeInMinutes,
          timeStartInMinutes: interval.startTimeInMinutes,
          userId: session.user.id,
        },
      }),
    ),
  )

  return res.status(201).end()
}
