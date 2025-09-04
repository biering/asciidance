import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { AsciiDance, DEFAULTS } from '../src'

// Mock canvas for testing
const createMockCanvas = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  return { canvas, ctx }
}

describe('AsciiDance', () => {
  let mockCanvas: HTMLCanvasElement
  let mockCtx: CanvasRenderingContext2D

  beforeEach(() => {
    const mock = createMockCanvas()
    mockCanvas = mock.canvas
    mockCtx = mock.ctx
  })

  afterEach(() => {
    // Clean up any running animations
    if (mockCanvas) {
      const field = new AsciiDance(mockCanvas)
      field.destroy()
    }
  })

  test('should create AsciiDance with default options', () => {
    const field = new AsciiDance(mockCanvas)
    const options = field.getOptions()

    expect(options).toEqual(DEFAULTS)
    expect(options.bg).toBe('#0a1118')
    expect(options.fg).toBe('#91a4b4')
    expect(options.palette).toBe(' .,:;=+*#%@')
    expect(options.fontPx).toBe(12)
  })

  test('should create AsciiDance with custom options', () => {
    const customOptions = {
      bg: '#000000',
      fg: '#ffffff',
      fontPx: 16,
      speed: 0.02,
    }

    const field = new AsciiDance(mockCanvas, customOptions)
    const options = field.getOptions()

    expect(options.bg).toBe('#000000')
    expect(options.fg).toBe('#ffffff')
    expect(options.fontPx).toBe(16)
    expect(options.speed).toBe(0.02)
    // Should still have other defaults
    expect(options.palette).toBe(DEFAULTS.palette)
  })

  test('should start and stop animation', () => {
    const field = new AsciiDance(mockCanvas)

    // Initially not started
    expect(field.getOptions()).toBeDefined()

    // Start animation
    field.start()

    // Should be able to stop
    field.stop()

    // Should be able to start again
    field.start()
    field.stop()
  })

  test('should update options at runtime', () => {
    const field = new AsciiDance(mockCanvas)

    // Update some options
    field.update({
      bg: '#ff0000',
      speed: 0.05,
      fontPx: 20,
    })

    const options = field.getOptions()
    expect(options.bg).toBe('#ff0000')
    expect(options.speed).toBe(0.05)
    expect(options.fontPx).toBe(20)
  })

  test('should handle resize', () => {
    const field = new AsciiDance(mockCanvas)

    // Should not throw when resizing
    expect(() => field.resize()).not.toThrow()
  })

  test('should destroy cleanly', () => {
    const field = new AsciiDance(mockCanvas)
    field.start()

    // Should not throw when destroying
    expect(() => field.destroy()).not.toThrow()
  })

  test('should throw error when canvas context is unavailable', () => {
    // Mock canvas without 2D context
    const canvasWithoutContext = {
      getContext: () => null,
    } as unknown as HTMLCanvasElement

    expect(() => new AsciiDance(canvasWithoutContext)).toThrow(
      '2D context unavailable',
    )
  })
})
