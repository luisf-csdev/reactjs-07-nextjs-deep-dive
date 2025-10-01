import { Box } from '@luisf-ignite-ui/react/box'
import { Button } from '@luisf-ignite-ui/react/button'
import { Checkbox } from '@luisf-ignite-ui/react/checkbox'
import { Heading } from '@luisf-ignite-ui/react/heading'
import { MultiStep } from '@luisf-ignite-ui/react/multi-step'
import { Text } from '@luisf-ignite-ui/react/text'
import { TextInput } from '@luisf-ignite-ui/react/text-input'
import { ArrowRight } from 'phosphor-react'

export default function TimeIntervals() {
  return (
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
        <form>
          <div className="mb-4 rounded-md border border-gray-600">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 [&+&]:border-t [&+&]:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <Checkbox />
                  <Text>Monday</Text>
                </div>

                <div className="flex items-center gap-2 [&_input::-webkit-calendar-picker-indicator]:filter-[invert(100%)_brightness(30%)]">
                  <TextInput size="sm" type="time" step={60} />
                  <TextInput size="sm" type="time" step={60} />
                </div>
              </div>
            ))}
          </div>

          <Button type="submit">
            Next step
            <ArrowRight />
          </Button>
        </form>
      </Box>
    </main>
  )
}
