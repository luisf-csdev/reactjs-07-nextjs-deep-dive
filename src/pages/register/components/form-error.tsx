import { Text } from '@luisf-ignite-ui/react/text'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

type FormErrorProps = ComponentProps<typeof Text>

export function FormError({ children, className, ...props }: FormErrorProps) {
  return (
    <Text size="sm" className={cn('!text-[#f75a68]', className)} {...props}>
      {children}
    </Text>
  )
}
