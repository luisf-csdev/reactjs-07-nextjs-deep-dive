import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar } from '@luisf-ignite-ui/react/avatar'
import { Box } from '@luisf-ignite-ui/react/box'
import { Button } from '@luisf-ignite-ui/react/button'
import { Heading } from '@luisf-ignite-ui/react/heading'
import { MultiStep } from '@luisf-ignite-ui/react/multi-step'
import { Text } from '@luisf-ignite-ui/react/text'
import { TextArea } from '@luisf-ignite-ui/react/text-area'
import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { api } from '@/lib/axios'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'

const updateProfileFormSchema = z.object({
  bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    await api.put('/users/profile', {
      bio: data.bio,
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  return (
    <>
      <NextSeo title="Update your profile | Ignite Call" noindex />

      <main className="mx-auto mt-20 mb-4 max-w-[572px] px-4">
        <div className="px-6">
          <Heading asChild className="leading-leading-base">
            <strong>Tell the world a bit about you</strong>
          </Heading>

          <Text className="mb-6 text-gray-200">
            Finally, a brief description and a profile picture.
          </Text>

          <MultiStep size={4} currentStep={4} />
        </div>

        <Box asChild className="mt-6 flex flex-col gap-4">
          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <label className="flex flex-col gap-2">
              <Text size="sm">Profile picture</Text>
              <Avatar
                src={session.data?.user.avatarUrl}
                alt={session.data?.user.name}
              />
            </label>

            <label className="flex flex-col gap-2">
              <Text size="sm">About you</Text>
              <TextArea {...register('bio')} />
              <Text size="sm" className="!text-gray-200">
                Tell us a little about yourself. This will be displayed on your
                personal page.
              </Text>
            </label>

            <Button disabled={isSubmitting} type="submit">
              Finish
              <ArrowRight />
            </Button>
          </form>
        </Box>
      </main>
    </>
  )
}
