import { Box } from '@luisf-ignite-ui/react/box'
import { Button } from '@luisf-ignite-ui/react/button'
import { Heading } from '@luisf-ignite-ui/react/heading'
import { MultiStep } from '@luisf-ignite-ui/react/multi-step'
import { Text } from '@luisf-ignite-ui/react/text'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { ArrowRight, Check } from 'phosphor-react'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleNavigateToNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <main className="mx-auto mt-20 mb-4 max-w-[572px] px-4">
      <div className="px-6">
        <Heading asChild className="leading-leading-base">
          <strong>Connect your calendar!</strong>
        </Heading>

        <Text className="mb-6 text-gray-200">
          Connect your calendar to automatically check busy times and new events
          as they&apos;re scheduled.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </div>

      <Box className="mt-6 flex flex-col">
        <div className="mb-4 flex items-center justify-between rounded-md border border-gray-600 px-6 py-4">
          <Text>Google Calendar</Text>
          {isSignedIn ? (
            <Button size="sm" disabled>
              Connected
              <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Connect
              <ArrowRight />
            </Button>
          )}
        </div>

        {hasAuthError && (
          <Text size="sm" className="mb-4 !text-[#f75a68]">
            Failed to connect to Google, please check if you have enabled access
            permissions to Google Calendar.
          </Text>
        )}

        <Button
          onClick={handleNavigateToNextStep}
          disabled={!isSignedIn}
          type="submit"
        >
          Next step
          <ArrowRight />
        </Button>
      </Box>
    </main>
  )
}
