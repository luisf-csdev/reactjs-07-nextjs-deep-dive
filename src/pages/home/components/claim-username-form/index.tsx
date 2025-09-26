import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@luisf-ignite-ui/react/box'
import { Button } from '@luisf-ignite-ui/react/button'
import { Text } from '@luisf-ignite-ui/react/text'
import { TextInput } from '@luisf-ignite-ui/react/text-input'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { error: 'Username must be at least 3 characters' })
    .regex(/^([a-z\\-]+)$/i, {
      error: 'Username must contain only letters and hyphens',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Box
        asChild
        className="mt-4 grid grid-cols-[1fr_auto] gap-2 p-4 [@media(max-width:600px)]:grid-cols-[1fr]"
      >
        <form onSubmit={handleSubmit(handleClaimUsername)}>
          <TextInput
            size="sm"
            prefix="ignite.com/"
            placeholder="your-username"
            {...register('username')}
          />

          <Button disabled={isSubmitting} size="sm" type="submit">
            Reserve
            <ArrowRight />
          </Button>
        </form>
      </Box>

      <div className="mt-2">
        <Text size="sm" className="text-gray-400">
          {errors.username
            ? errors.username.message
            : 'Type your desired username'}
        </Text>
      </div>
    </>
  )
}
