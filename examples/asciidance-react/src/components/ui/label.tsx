import { cn } from '@/lib/utils'
import * as React from 'react'

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        'text-foreground text-sm leading-none font-medium',
        className,
      )}
      {...props}
    />
  )
}
