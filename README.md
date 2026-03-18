# AsciiDance

A beautiful ASCII art animation library with customizable noise patterns and effects.

![asciidance](https://github.com/user-attachments/assets/4c84b03b-9c11-41c4-8bbd-8a964ab4ecae)

## Live Demo

🎬 **[View Live Demo on GitHub Pages](https://ascii.dance)**

## Features

- 🌊 Fluid ASCII art animations using noise patterns
- 🎨 Customizable color palettes and visual effects
- ⚡ High-performance Canvas-based rendering
- 📱 Responsive design with mobile support
- ♿ Accessibility features (respects `prefers-reduced-motion`)
- 🎛️ Runtime configuration options
- 📦 Zero runtime dependencies

## Usage

### Basic Usage (ESM)

```ts
import AsciiDance from '@chryb/asciidance'

const canvas = document.getElementById('ascii-canvas') as HTMLCanvasElement
const asciiField = new AsciiDance(canvas)
asciiField.start()
```

### With Custom Options

```ts
import { AsciiField } from '@chryb/asciidance'

const canvas = document.getElementById('ascii-canvas') as HTMLCanvasElement
const asciiField = new AsciiField(canvas, {
  bg: '#000000',
  fg: '#00ff00',
  palette: ' .:-=+*#%@',
  speed: 0.02,
  fontPx: 14,
})
asciiField.start()
```

### API

#### Constructor

```ts
new AsciiField(canvas: HTMLCanvasElement, options?: Partial<AsciiFieldOptions>)
```

#### Methods

- `start()` - Start the animation loop
- `stop()` - Stop the animation loop
- `destroy()` - Clean up and destroy the instance
- `update(options: Partial<AsciiFieldOptions>)` - Update options at runtime
- `resize()` - Force resize (useful when container size changes)

## Installation

```bash
npm install @chryb/asciidance
```

> AsciiDance has zero runtime dependencies. The packages in this repo are for development, testing, and publishing only.

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

## Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch.
2. Make your changes and include tests when possible.
3. Run `npm run build` and `npm test`.
4. Open a pull request with a clear description and test notes.

## GitHub Pages Setup

This repository is configured for automatic deployment to GitHub Pages:

1. The `index.html` file in the root serves as the GitHub Pages entry point
2. GitHub Actions automatically builds and deploys on every push to `main`
3. The live demo is available at: https://biering.github.io/asciidance

## License

MIT
