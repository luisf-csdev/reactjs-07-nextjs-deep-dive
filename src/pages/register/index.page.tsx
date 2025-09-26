import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@luisf-ignite-ui/react/box'
import { Button } from '@luisf-ignite-ui/react/button'
import { Heading } from '@luisf-ignite-ui/react/heading'
import { MultiStep } from '@luisf-ignite-ui/react/multi-step'
import { Text } from '@luisf-ignite-ui/react/text'
import { TextInput } from '@luisf-ignite-ui/react/text-input'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { api } from '@/lib/axios'

import { FormError } from './components/form-error'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { error: 'Username must be at least 3 characters' })
    .regex(/^([a-z\\-]+)$/i, {
      error: 'Username must contain only letters and hyphens',
    })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, { error: 'Name must contain at least 3 characters' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data.message) {
        alert(err.response?.data.message)
        return
      }
      console.log(err)
    }
  }

  return (
    <main className="mx-auto mt-20 mb-4 max-w-[572px] px-4">
      <div className="px-6">
        <Heading asChild className="leading-leading-base">
          <strong>Welcome to Ignite Call!</strong>
        </Heading>

        <Text className="mb-6 text-gray-200">
          We need some information to create your profile! Oh, and you can edit
          this information later.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </div>

      <Box asChild className="mt-6 flex flex-col gap-4">
        <form onSubmit={handleSubmit(handleRegister)}>
          <label className="flex flex-col gap-2">
            <Text size="sm">Username</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="your-username"
              {...register('username')}
            />

            {errors.username && (
              <FormError>{errors.username.message}</FormError>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <Text size="sm">Full name</Text>
            <TextInput placeholder="Your name" {...register('name')} />

            {errors.name && <FormError>{errors.name.message}</FormError>}
          </label>

          <Button disabled={isSubmitting} type="submit">
            Next step
            <ArrowRight />
          </Button>
        </form>
      </Box>
    </main>
  )
}
