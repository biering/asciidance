import { createCanvas } from 'canvas'

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { }, // deprecated
    removeListener: () => { }, // deprecated
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => { },
  }),
})

// Mock HTMLCanvasElement for jsdom
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function (contextType: string, contextAttributes?: any) {
    if (contextType === '2d') {
      const canvas = createCanvas(800, 600)
      return canvas.getContext('2d')
    }
    return null
  },
})

// Mock canvas dimensions
Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
  get: function () {
    return 800
  },
  set: function (value: number) {
    // Mock implementation
  },
})

Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
  get: function () {
    return 600
  },
  set: function (value: number) {
    // Mock implementation
  },
})
