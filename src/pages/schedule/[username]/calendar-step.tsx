import { Box } from '@luisf-ignite-ui/react/box'

import { Calendar } from '@/components/calendar'

export function CalendarStep() {
  return (
    <Box className="relative mx-auto mt-6 grid w-[540px] max-w-full grid-cols-1 p-0">
      <Calendar />
    </Box>
  )
}
