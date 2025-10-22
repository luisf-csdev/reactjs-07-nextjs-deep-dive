import { Text } from '@luisf-ignite-ui/react/text'
import { CaretLeft, CaretRight } from 'phosphor-react'

import { getWeekDays } from '@/utils/get-week-days'

const shortWeekDays = getWeekDays({ short: true })
export function Calendar() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Text className="font-medium">
          October <span className="text-gray-200">2025</span>
        </Text>

        <div className="flex gap-2 text-gray-200 *:*:size-5 *:cursor-pointer *:rounded-sm *:leading-0 *:hover:text-gray-100 *:focus:shadow-[0_0_0_2px_var(--color-gray-100)]">
          <button>
            <CaretLeft />
          </button>
          <button>
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
          <tr>
            {Array.from({ length: 7 }).map((_, i) => (
              <td key={i}>
                <button className="aspect-square w-full cursor-pointer rounded-sm bg-gray-600 text-center not-[disabled]:hover:bg-gray-500 focus:shadow-[0_0_0_2px_var(--color-gray-100)] disabled:cursor-default disabled:bg-none disabled:opacity-40">
                  {i + 1}
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
