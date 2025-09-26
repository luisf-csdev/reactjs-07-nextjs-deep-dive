import { Text } from '@luisf-ignite-ui/react/text'
import type { ComponentProps } from 'react'

type FormErrorProps = ComponentProps<typeof Text>

export function FormError({ children, ...props }: FormErrorProps) {
  return (
    <Text size="sm" className="!text-[#f75a68]" {...props}>
      {children}
    </Text>
  )
}
