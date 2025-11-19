import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@luisf-ignite-ui/react/box'
import { Button } from '@luisf-ignite-ui/react/button'
import { Text } from '@luisf-ignite-ui/react/text'
import { TextArea } from '@luisf-ignite-ui/react/text-area'
import { TextInput } from '@luisf-ignite-ui/react/text-input'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CalendarBlank, Clock } from 'phosphor-react'
import type { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { api } from '@/lib/axios'
import { cn } from '@/lib/cn'

const confirmFormSchema = z.object({
  name: z.string().min(3, { error: 'It must be at least 3 characters' }),
  email: z.email({ error: 'It must be a valid email' }),
  observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

type ConfirmStepProps = {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const router = useRouter()
  const username = String(router.query.username)

  async function handleConfirmScheduling(data: ConfirmFormData) {
    const { email, name, observations } = data

    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date: schedulingDate,
    })

    onCancelConfirmation()
  }

  const describedDate = dayjs(schedulingDate).format('MMMM DD[, ] YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <Box asChild>
      <form
        className="mx-auto mt-6 flex w-full max-w-[540px] flex-col gap-4 [&_label]:flex [&_label]:flex-col [&_label]:gap-2"
        onSubmit={handleSubmit(handleConfirmScheduling)}
      >
        <div className="mb-2 flex items-center gap-4 border-b border-gray-600 pb-6 *:flex *:items-center *:gap-2">
          <Text>
            <CalendarBlank className="size-5 text-gray-200" />
            {describedDate}
          </Text>
          <Text>
            <Clock className="size-5 text-gray-200" />
            {describedTime}
          </Text>
        </div>

        <label>
          <Text size="sm">Full name</Text>
          <TextInput placeholder="Your name" {...register('name')} />
          {errors.name && <FormError>{errors.name.message}</FormError>}
        </label>

        <label>
          <Text size="sm">Email address</Text>
          <TextInput
            type="email"
            placeholder="johndoe@example.com"
            {...register('email')}
          />
          {errors.email && <FormError>{errors.email.message}</FormError>}
        </label>

        <label>
          <Text size="sm">Observations</Text>
          <TextArea {...register('observations')} />
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            onClick={onCancelConfirmation}
            type="button"
            variant="tertiary"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Confirm
          </Button>
        </div>
      </form>
    </Box>
  )
}

function FormError({
  size: _,
  className,
  children,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text size="sm" className={cn('text-[#f75a68]!', className)} {...props}>
      {children}
    </Text>
  )
}
