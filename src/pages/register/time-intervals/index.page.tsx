import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@luisf-ignite-ui/react/box'
import { Button } from '@luisf-ignite-ui/react/button'
import { Checkbox } from '@luisf-ignite-ui/react/checkbox'
import { Heading } from '@luisf-ignite-ui/react/heading'
import { MultiStep } from '@luisf-ignite-ui/react/multi-step'
import { Text } from '@luisf-ignite-ui/react/text'
import { TextInput } from '@luisf-ignite-ui/react/text-input'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { api } from '@/lib/axios'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { getWeekDays } from '@/utils/get-week-days'

import { FormError } from '../components/form-error'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      error: 'You need to select at least one day in the week!',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
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

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

const weekDays = getWeekDays()

export default function TimeIntervals() {
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput, unknown, TimeIntervalsFormOutput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        {
          weekDay: 0,
          enabled: false,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 1,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 2,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 3,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 4,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 5,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 6,
          enabled: false,
          startTime: '08:00',
          endTime: '18:00',
        },
      ],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  const router = useRouter()

  async function handleSetTimeIntervals({
    intervals,
  }: TimeIntervalsFormOutput) {
    await api.post('/users/time-intervals', {
      intervals,
    })

    await router.push('/register/update-profile')
  }

  return (
    <>
      <NextSeo title="Select your availability  | Ignite Call" noindex />

      <main className="mx-auto mt-20 mb-4 max-w-[572px] px-4">
        <div className="px-6">
          <Heading asChild className="leading-leading-base">
            <strong>Almost there!</strong>
          </Heading>

          <Text className="mb-6 text-gray-200">
            Set the time range you are available each day of the week.
          </Text>

          <MultiStep size={4} currentStep={3} />
        </div>
        <Box asChild className="mt-6 flex flex-col">
          <form onSubmit={handleSubmit(handleSetTimeIntervals)}>
            <div className="mb-4 rounded-md border border-gray-600">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between px-4 py-3 [&+&]:border-t [&+&]:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <Controller
                      name={`intervals.${index}.enabled`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true)
                          }}
                          checked={field.value}
                        />
                      )}
                    />

                    <Text>{weekDays[field.weekDay]}</Text>
                  </div>

                  <div className="flex items-center gap-2 [&_input::-webkit-calendar-picker-indicator]:filter-[invert(100%)_brightness(30%)]">
                    <TextInput
                      //@ts-expect-error Property is correct
                      size="sm"
                      type="time"
                      step={60}
                      disabled={intervals[index].enabled === false}
                      {...register(`intervals.${index}.startTime`)}
                    />
                    <TextInput
                      //@ts-expect-error Property is correct
                      size="sm"
                      type="time"
                      step={60}
                      disabled={intervals[index].enabled === false}
                      {...register(`intervals.${index}.endTime`)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {!!errors.intervals?.root?.message && (
              <FormError className="mb-4">
                {errors.intervals?.root?.message}
              </FormError>
            )}

            <Button disabled={isSubmitting} type="submit">
              Next step
              <ArrowRight />
            </Button>
          </form>
        </Box>
      </main>
    </>
  )
}
