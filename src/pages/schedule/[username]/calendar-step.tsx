import { Box } from '@luisf-ignite-ui/react/box'
import { Text } from '@luisf-ignite-ui/react/text'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Calendar } from '@/components/calendar'
import { api } from '@/lib/axios'
import { cn } from '@/lib/cn'

type Availability = {
  possibleTimes: number[]
  availableTimes: number[]
}

type CalendarStepProps = {
  onSelectedDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectedDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const isDateSelected = !!selectedDate
  const username = String(router.query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('MMMM DD')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<Availability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })
      return response.data
    },
    enabled: !!selectedDate,
  })

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectedDateTime(dateWithTime)
  }

  return (
    <Box
      className={cn(
        'relative mx-auto mt-6 grid w-[540px] max-w-full grid-cols-1 p-0',
        isDateSelected &&
          'w-auto grid-cols-[1fr_280px] [@media(max-width:900px)]:grid-cols-1',
      )}
    >
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <div className="absolute top-0 right-0 bottom-0 w-[280px] overflow-y-scroll border-l border-l-gray-600 px-6 pt-6">
          <Text className="font-medium capitalize">
            {weekDay} <span className="text-gray-200">{describedDate}</span>
          </Text>

          <div className="mt-3 grid grid-cols-1 gap-2 [@media(max-width:900px)]:grid-cols-2">
            {availability?.possibleTimes.map((hour) => (
              <button
                className={cn(
                  'cursor-pointer rounded-sm bg-gray-600 py-2 text-sm leading-leading-base text-gray-100',
                  'last:mb-6',
                  'not-disabled:hover:bg-gray-500',
                  'focus:shadow-[0_0_0_2px_var(--color-gray-100)]',
                  'disabled:cursor-default disabled:bg-none disabled:opacity-40',
                )}
                key={hour}
                onClick={() => handleSelectTime(hour)}
                disabled={!availability.availableTimes.includes(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </button>
            ))}
          </div>
        </div>
      )}
    </Box>
  )
}
