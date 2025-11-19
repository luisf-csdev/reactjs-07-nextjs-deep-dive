import { Text } from '@luisf-ignite-ui/react/text'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'

import { api } from '@/lib/axios'
import { getWeekDays } from '@/utils/get-week-days'

type CalendarWeek = {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type BlockedDates = {
  blockedWeekDays: number[]
  blockedDates: number[]
}

type CalendarProps = {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

const shortWeekDays = getWeekDays({ short: true })

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')
    setCurrentDate(nextMonthDate)
  }

  const currentMoth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = String(router.query.username)

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      'blocked-dates',
      currentDate.get('year'),
      currentDate.get('month'),
    ],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month') + 1,
        },
      })
      return response.data
    },
  })

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')
    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    })
      .map((_, i) => {
        return lastDayInCurrentMonth.add(i + 1, 'day')
      })
      .reverse()

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeek[]>(
      (weeks, _day, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Text className="font-medium capitalize">
          {currentMoth} <span className="text-gray-200">{currentYear}</span>
        </Text>

        <div className="flex gap-2 text-gray-200 *:*:size-5 *:cursor-pointer *:rounded-sm *:leading-0 *:hover:text-gray-100 *:focus:shadow-[0_0_0_2px_var(--color-gray-100)]">
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </div>
      </div>

      <table className="w-full table-fixed border-separate border-spacing-[0.25rem] font-default">
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th className="text-sm font-medium text-gray-200" key={weekDay}>
                {weekDay}.
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="before:block before:leading-[0.75rem] before:text-gray-800 before:content-['.']">
          {calendarWeeks.map(({ days, week }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <button
                    onClick={() => onDateSelected(date.toDate())}
                    disabled={disabled}
                    className="aspect-square w-full cursor-pointer rounded-sm bg-gray-600 text-center not-disabled:hover:bg-gray-500 focus:shadow-[0_0_0_2px_var(--color-gray-100)] disabled:cursor-default disabled:bg-transparent disabled:opacity-40"
                  >
                    {date.get('date')}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
