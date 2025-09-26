import { Heading } from '@luisf-ignite-ui/react/heading'
import { Text } from '@luisf-ignite-ui/react/text'
import Image from 'next/image'

import previewImage from '@/assets/app-preview.png'

import { ClaimUsernameForm } from './components/claim-username-form'

export function Home() {
  return (
    <div className="ml-auto flex h-svh max-w-[calc(100vw-(100vw-1160px)/2)] items-center gap-20">
      <div className="max-w-[480px] px-10">
        <Heading
          asChild
          className="font-bold [@media(max-width:600px)]:text-6xl"
          size="4xl"
        >
          <h1>Hassle-free Scheduling</h1>
        </Heading>
        <Text className="mt-2 text-gray-200" size="xl">
          Connect your calendar and let people schedule appointments on their
          own time.
        </Text>

        <ClaimUsernameForm />
      </div>

      <div className="shrink-0 overflow-hidden pr-8 [@media(max-width:600px)]:hidden">
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt="Calendar symbolizing the application in operation"
        />
      </div>
    </div>
  )
}
