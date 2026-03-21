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
      const mockCtx = {
        canvas: this,
        fillStyle: '#000000',
        globalAlpha: 1,
        font: '12px monospace',
        textBaseline: 'top',
        setTransform: () => { },
        fillRect: () => { },
        fillText: () => { },
        measureText: (text: string) =>
          ({
            width: Math.max(1, text.length * 8),
          }) as TextMetrics,
      }
      return mockCtx as unknown as CanvasRenderingContext2D
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
    // Mock
  },
})
