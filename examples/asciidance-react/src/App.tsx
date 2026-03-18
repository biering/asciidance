import { ExternalLink } from 'lucide-react'
import { useState } from 'react'

import { type AsciiDanceOptions, DEFAULTS } from '../../../src'
import AsciiDance from './AsciiDance'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'

interface RangeControlProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 0.001,
  onChange,
}: RangeControlProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground text-xs">{label}</Label>
        <span className="text-muted-foreground text-xs">
          {value.toFixed(3)}
        </span>
      </div>
      <Input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-primary h-2 cursor-pointer border-0 bg-transparent p-0"
      />
    </div>
  )
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full cursor-pointer p-1"
      />
    </div>
  )
}

function App() {
  const [options, setOptions] = useState<AsciiDanceOptions>({ ...DEFAULTS })

  const updateOption = <K extends keyof AsciiDanceOptions>(
    key: K,
    value: AsciiDanceOptions[K],
  ) => setOptions((prev) => ({ ...prev, [key]: value }))

  const sectionClass = 'space-y-3 border-b border-border pb-4'

  return (
    <>
      <AsciiDance {...options} />

      <aside className="border-border bg-background/90 fixed top-5 left-5 z-50 max-h-[calc(100vh-40px)] w-[320px] overflow-y-auto rounded-lg border p-3 shadow-lg backdrop-blur-sm">
        <div className="mb-4 flex min-h-8 items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide uppercase">
            AsciiDance Controls
          </h2>
        </div>

        <div className="space-y-4">
          <a
            href="https://github.com/biering/asciidance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            View on GitHub
          </a>

          <section className={sectionClass}>
            <h3 className="text-xs font-semibold tracking-wide uppercase">
              Look
            </h3>
            <ColorControl
              label="Background"
              value={options.bg}
              onChange={(v) => updateOption('bg', v)}
            />
            <ColorControl
              label="Foreground"
              value={options.fg}
              onChange={(v) => updateOption('fg', v)}
            />
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Palette</Label>
              <Input
                value={options.palette}
                onChange={(e) => updateOption('palette', e.target.value)}
              />
            </div>
            <RangeControl
              label="Font Size"
              value={options.fontPx}
              min={8}
              max={24}
              step={1}
              onChange={(v) => updateOption('fontPx', v)}
            />
            <RangeControl
              label="Contrast"
              value={options.contrast}
              min={0.5}
              max={2}
              step={0.01}
              onChange={(v) => updateOption('contrast', v)}
            />
          </section>

          <section className={sectionClass}>
            <h3 className="text-xs font-semibold tracking-wide uppercase">
              Animation
            </h3>
            <RangeControl
              label="Speed"
              value={options.speed}
              min={0.001}
              max={0.1}
              step={0.001}
              onChange={(v) => updateOption('speed', v)}
            />
            <RangeControl
              label="Scale"
              value={options.scale}
              min={0.01}
              max={0.2}
              step={0.001}
              onChange={(v) => updateOption('scale', v)}
            />
            <RangeControl
              label="Opacity Base"
              value={options.opacityBase}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => updateOption('opacityBase', v)}
            />
            <RangeControl
              label="Opacity Variation"
              value={options.opacityVar}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => updateOption('opacityVar', v)}
            />
            <label className="text-muted-foreground flex items-center gap-2 text-xs">
              <Input
                type="checkbox"
                checked={options.reducedMotionFallback}
                onChange={(e) =>
                  updateOption('reducedMotionFallback', e.target.checked)
                }
                className="border-input h-4 w-4 rounded p-0"
              />
              Reduced Motion Fallback
            </label>
          </section>

          <section className={sectionClass}>
            <h3 className="text-xs font-semibold tracking-wide uppercase">
              Noise Shaping
            </h3>
            <RangeControl
              label="Seed"
              value={options.seed}
              min={1}
              max={10000}
              step={1}
              onChange={(v) => updateOption('seed', v)}
            />
            <RangeControl
              label="Cell Size"
              value={options.cellSize}
              min={50}
              max={500}
              step={1}
              onChange={(v) => updateOption('cellSize', v)}
            />
            <RangeControl
              label="Octaves"
              value={options.octaves}
              min={1}
              max={6}
              step={1}
              onChange={(v) => updateOption('octaves', v)}
            />
            <RangeControl
              label="Lacunarity"
              value={options.lacunarity}
              min={1}
              max={3}
              step={0.01}
              onChange={(v) => updateOption('lacunarity', v)}
            />
            <RangeControl
              label="Gain"
              value={options.gain}
              min={0.1}
              max={1}
              step={0.01}
              onChange={(v) => updateOption('gain', v)}
            />
            <RangeControl
              label="Plateau Steps"
              value={options.plateauSteps ?? 0}
              min={0}
              max={20}
              step={1}
              onChange={(v) => updateOption('plateauSteps', v === 0 ? null : v)}
            />
            <RangeControl
              label="Warp Amplitude"
              value={options.warpAmp}
              min={0}
              max={50}
              step={0.1}
              onChange={(v) => updateOption('warpAmp', v)}
            />
            <RangeControl
              label="Warp Frequency"
              value={options.warpFreq}
              min={0.1}
              max={2}
              step={0.01}
              onChange={(v) => updateOption('warpFreq', v)}
            />
          </section>

          <section className={sectionClass}>
            <h3 className="text-xs font-semibold tracking-wide uppercase">
              Motion
            </h3>
            <RangeControl
              label="Drift Amplitude"
              value={options.driftAmp}
              min={0}
              max={100}
              step={0.1}
              onChange={(v) => updateOption('driftAmp', v)}
            />
            <RangeControl
              label="Wobble Amplitude"
              value={options.wobbleAmp}
              min={0}
              max={100}
              step={0.1}
              onChange={(v) => updateOption('wobbleAmp', v)}
            />
            <RangeControl
              label="Wobble Frequency"
              value={options.wobbleFreq}
              min={0.01}
              max={0.5}
              step={0.001}
              onChange={(v) => updateOption('wobbleFreq', v)}
            />
          </section>

          <section className={sectionClass}>
            <h3 className="text-xs font-semibold tracking-wide uppercase">
              Tonemapping
            </h3>
            <label className="text-muted-foreground flex items-center gap-2 text-xs">
              <Input
                type="checkbox"
                checked={options.autoLevel}
                onChange={(e) => updateOption('autoLevel', e.target.checked)}
                className="border-input h-4 w-4 rounded p-0"
              />
              Auto Level
            </label>
            <RangeControl
              label="Auto Level Decay"
              value={options.autoLevelDecay}
              min={0.9}
              max={0.999}
              step={0.001}
              onChange={(v) => updateOption('autoLevelDecay', v)}
            />
            <RangeControl
              label="Gamma"
              value={options.gamma}
              min={0.5}
              max={2.5}
              step={0.01}
              onChange={(v) => updateOption('gamma', v)}
            />
            <label className="text-muted-foreground flex items-center gap-2 text-xs">
              <Input
                type="checkbox"
                checked={options.invert}
                onChange={(e) => updateOption('invert', e.target.checked)}
                className="border-input h-4 w-4 rounded p-0"
              />
              Invert
            </label>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wide uppercase">
              Sizing
            </h3>
            <Label className="text-muted-foreground text-xs">Size Mode</Label>
            <select
              value={options.sizeMode}
              onChange={(e) =>
                updateOption('sizeMode', e.target.value as 'window' | 'element')
              }
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 text-sm"
            >
              <option value="window">Window</option>
              <option value="element">Element</option>
            </select>
          </section>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setOptions({ ...DEFAULTS })}
          >
            Reset to Defaults
          </Button>
        </div>
      </aside>
    </>
  )
}

export default App
