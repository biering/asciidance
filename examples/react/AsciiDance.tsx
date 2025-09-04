import React, { useEffect, useRef } from 'react'

import { AsciiField, AsciiFieldOptions, DEFAULTS } from 'asciidance'

export type ReactAsciiProps = Partial<AsciiFieldOptions> &
  React.HTMLAttributes<HTMLCanvasElement>

export default function AsciiFieldCanvas({ style, ...opts }: ReactAsciiProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<AsciiField | null>(null)

  useEffect(() => {
    const el = ref.current!
    engineRef.current = new AsciiField(el, {
      ...DEFAULTS,
      sizeMode: 'element',
      ...opts,
    })
    engineRef.current.start()
    return () => engineRef.current?.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    engineRef.current?.update({ ...opts })
  }, [JSON.stringify(opts)])

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
      aria-hidden
    />
  )
}
