import React, { useEffect, useRef } from 'react'

import {
  AsciiDance as AsciiDanceEngine,
  type AsciiDanceOptions,
  DEFAULTS,
} from '../../../src'

export type ReactAsciiProps = Partial<AsciiDanceOptions> &
  React.HTMLAttributes<HTMLCanvasElement>

export default function AsciiDanceView({ style, ...opts }: ReactAsciiProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<AsciiDanceEngine | null>(null)

  useEffect(() => {
    const el = ref.current!
    engineRef.current = new AsciiDanceEngine(el, {
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
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        ...style,
      }}
      aria-hidden
    />
  )
}
