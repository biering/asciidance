# AsciiDance

A beautiful ASCII art animation library with customizable noise patterns and effects.

## Live Demo

🎬 **[View Live Demo on GitHub Pages](https://cbiering.github.io/asciidance)**

## Features

- 🌊 Fluid ASCII art animations using noise patterns
- 🎨 Customizable color palettes and visual effects
- ⚡ High-performance Canvas-based rendering
- 📱 Responsive design with mobile support
- ♿ Accessibility features (respects `prefers-reduced-motion`)
- 🎛️ Runtime configuration options
- 📦 Zero dependencies

## Usage

### Basic Usage

```html
<canvas id="ascii-canvas"></canvas>
<script src="./index.js"></script>
<script>
    const canvas = document.getElementById('ascii-canvas');
    const asciiField = new AsciiField(canvas);
    asciiField.start();
</script>
```

### With Custom Options

```html
<canvas id="ascii-canvas"></canvas>
<script src="./index.js"></script>
<script>
    const canvas = document.getElementById('ascii-canvas');
    const asciiField = new AsciiField(canvas, {
        bg: '#000000',
        fg: '#00ff00',
        palette: ' .:-=+*#%@',
        speed: 0.02,
        fontPx: 14
    });
    asciiField.start();
</script>
```

### API

#### Constructor
```typescript
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
npm install asciidance
```

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

## GitHub Pages Setup

This repository is configured for automatic deployment to GitHub Pages:

1. The `index.html` file in the root serves as the GitHub Pages entry point
2. GitHub Actions automatically builds and deploys on every push to `main`
3. The live demo is available at: https://cbiering.github.io/asciidance

## License

MIT
