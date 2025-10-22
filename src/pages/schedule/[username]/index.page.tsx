import { Avatar } from '@luisf-ignite-ui/react/avatar'
import { Heading } from '@luisf-ignite-ui/react/heading'
import { Text } from '@luisf-ignite-ui/react/text'
import type { GetStaticPaths, GetStaticProps } from 'next'

import { prisma } from '@/lib/prisma'

import { ScheduleForm } from './schedule-form'

type ScheduleProps = {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

const DAY_IN_SECONDS = 60 * 60 * 24

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    },
    revalidate: DAY_IN_SECONDS,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <div className="mx-auto mt-20 mb-4 max-w-[852px] px-4">
      <div className="flex flex-col items-center">
        <Avatar src={user.avatarUrl} />
        <Heading className="mt-2 leading-leading-base">{user.name}</Heading>
        <Text className="text-gray-200">{user.bio}</Text>

        <ScheduleForm />
      </div>
    </div>
  )
}
