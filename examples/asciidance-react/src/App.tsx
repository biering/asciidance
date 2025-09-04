import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import React, { useState } from 'react'

import { type AsciiDanceOptions, DEFAULTS } from '../../../src'
import AsciiDance from './AsciiDance'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

function Slider({
  label,
  value,
  min,
  max,
  step = 0.001,
  onChange,
}: SliderProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '4px',
          fontSize: '12px',
          color: '#91a4b4',
        }}
      >
        {label}: {value.toFixed(3)}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '4px',
          background: '#2a3441',
          outline: 'none',
          borderRadius: '2px',
          appearance: 'none',
        }}
      />
    </div>
  )
}

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '4px',
          fontSize: '12px',
          color: '#91a4b4',
        }}
      >
        {label}:
      </label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '32px',
          border: '1px solid #2a3441',
          borderRadius: '4px',
          background: 'transparent',
          cursor: 'pointer',
        }}
      />
    </div>
  )
}

interface TextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function TextInput({ label, value, onChange }: TextInputProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '4px',
          fontSize: '12px',
          color: '#91a4b4',
        }}
      >
        {label}:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 8px',
          border: '1px solid #2a3441',
          borderRadius: '4px',
          background: '#1a1f2e',
          color: '#91a4b4',
          fontSize: '12px',
        }}
      />
    </div>
  )
}

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          color: '#91a4b4',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ marginRight: '8px' }}
        />
        {label}
      </label>
    </div>
  )
}

function App() {
  const [options, setOptions] = useState<AsciiDanceOptions>(DEFAULTS)
  const [isPanelExpanded, setIsPanelExpanded] = useState(true)

  const updateOption = <K extends keyof AsciiDanceOptions>(
    key: K,
    value: AsciiDanceOptions[K],
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  const controlPanelStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    width: isPanelExpanded ? '300px' : '80px',
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto',
    background: 'rgba(10, 17, 24, 0.9)',
    border: '1px solid #2a3441',
    borderRadius: '8px',
    padding: isPanelExpanded ? '16px' : '8px',
    zIndex: 1000,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: '12px',
    transition: 'width 0.3s ease, padding 0.3s ease',
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #2a3441',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#91a4b4',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }

  return (
    <>
      <AsciiDance {...options} />

      <div style={controlPanelStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isPanelExpanded ? 'space-between' : 'center',
            marginBottom: isPanelExpanded ? '20px' : '0',
            minHeight: '32px',
          }}
        >
          {isPanelExpanded && (
            <h2 style={{ margin: 0, color: '#91a4b4', fontSize: '16px' }}>
              AsciiDance Controls
            </h2>
          )}
          <button
            onClick={() => setIsPanelExpanded(!isPanelExpanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#91a4b4',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              minHeight: '32px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#2a3441')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            {isPanelExpanded ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </div>

        {isPanelExpanded && (
          <>
            <div
              style={{
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid #2a3441',
              }}
            >
              <a
                href="https://github.com/cbiering/asciidance"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#91a4b4',
                  textDecoration: 'none',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#91a4b4')}
              >
                <ExternalLink size={12} />
                <span>View on GitHub</span>
              </a>
            </div>

            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Look</h3>
              <ColorInput
                label="Background"
                value={options.bg}
                onChange={(v) => updateOption('bg', v)}
              />
              <ColorInput
                label="Foreground"
                value={options.fg}
                onChange={(v) => updateOption('fg', v)}
              />
              <TextInput
                label="Palette"
                value={options.palette}
                onChange={(v) => updateOption('palette', v)}
              />
              <Slider
                label="Font Size"
                value={options.fontPx}
                min={8}
                max={24}
                step={1}
                onChange={(v) => updateOption('fontPx', v)}
              />
              <Slider
                label="Contrast"
                value={options.contrast}
                min={0.5}
                max={2.0}
                step={0.01}
                onChange={(v) => updateOption('contrast', v)}
              />
            </div>

            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Animation</h3>
              <Slider
                label="Speed"
                value={options.speed}
                min={0.001}
                max={0.1}
                step={0.001}
                onChange={(v) => updateOption('speed', v)}
              />
              <Slider
                label="Scale"
                value={options.scale}
                min={0.01}
                max={0.2}
                step={0.001}
                onChange={(v) => updateOption('scale', v)}
              />
              <Slider
                label="Opacity Base"
                value={options.opacityBase}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => updateOption('opacityBase', v)}
              />
              <Slider
                label="Opacity Variation"
                value={options.opacityVar}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => updateOption('opacityVar', v)}
              />
              <Checkbox
                label="Reduced Motion Fallback"
                checked={options.reducedMotionFallback}
                onChange={(v) => updateOption('reducedMotionFallback', v)}
              />
            </div>

            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Noise Shaping</h3>
              <Slider
                label="Seed"
                value={options.seed}
                min={1}
                max={10000}
                step={1}
                onChange={(v) => updateOption('seed', v)}
              />
              <Slider
                label="Cell Size"
                value={options.cellSize}
                min={50}
                max={500}
                step={1}
                onChange={(v) => updateOption('cellSize', v)}
              />
              <Slider
                label="Octaves"
                value={options.octaves}
                min={1}
                max={6}
                step={1}
                onChange={(v) => updateOption('octaves', v)}
              />
              <Slider
                label="Lacunarity"
                value={options.lacunarity}
                min={1.0}
                max={3.0}
                step={0.01}
                onChange={(v) => updateOption('lacunarity', v)}
              />
              <Slider
                label="Gain"
                value={options.gain}
                min={0.1}
                max={1.0}
                step={0.01}
                onChange={(v) => updateOption('gain', v)}
              />
              <Slider
                label="Plateau Steps"
                value={options.plateauSteps || 0}
                min={0}
                max={20}
                step={1}
                onChange={(v) =>
                  updateOption('plateauSteps', v === 0 ? null : v)
                }
              />
              <Slider
                label="Warp Amplitude"
                value={options.warpAmp}
                min={0}
                max={50}
                step={0.1}
                onChange={(v) => updateOption('warpAmp', v)}
              />
              <Slider
                label="Warp Frequency"
                value={options.warpFreq}
                min={0.1}
                max={2.0}
                step={0.01}
                onChange={(v) => updateOption('warpFreq', v)}
              />
            </div>

            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Motion</h3>
              <Slider
                label="Drift Amplitude"
                value={options.driftAmp}
                min={0}
                max={100}
                step={0.1}
                onChange={(v) => updateOption('driftAmp', v)}
              />
              <Slider
                label="Wobble Amplitude"
                value={options.wobbleAmp}
                min={0}
                max={100}
                step={0.1}
                onChange={(v) => updateOption('wobbleAmp', v)}
              />
              <Slider
                label="Wobble Frequency"
                value={options.wobbleFreq}
                min={0.01}
                max={0.5}
                step={0.001}
                onChange={(v) => updateOption('wobbleFreq', v)}
              />
            </div>

            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Tonemapping</h3>
              <Checkbox
                label="Auto Level"
                checked={options.autoLevel}
                onChange={(v) => updateOption('autoLevel', v)}
              />
              <Slider
                label="Auto Level Decay"
                value={options.autoLevelDecay}
                min={0.9}
                max={0.999}
                step={0.001}
                onChange={(v) => updateOption('autoLevelDecay', v)}
              />
              <Slider
                label="Gamma"
                value={options.gamma}
                min={0.5}
                max={2.5}
                step={0.01}
                onChange={(v) => updateOption('gamma', v)}
              />
              <Checkbox
                label="Invert"
                checked={options.invert}
                onChange={(v) => updateOption('invert', v)}
              />
            </div>

            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Sizing</h3>
              <div style={{ marginBottom: '12px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    color: '#91a4b4',
                  }}
                >
                  Size Mode:
                </label>
                <select
                  value={options.sizeMode}
                  onChange={(e) =>
                    updateOption(
                      'sizeMode',
                      e.target.value as 'window' | 'element',
                    )
                  }
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #2a3441',
                    borderRadius: '4px',
                    background: '#1a1f2e',
                    color: '#91a4b4',
                    fontSize: '12px',
                  }}
                >
                  <option value="window">Window</option>
                  <option value="element">Element</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setOptions(DEFAULTS)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#2a3441',
                border: '1px solid #3a4451',
                borderRadius: '4px',
                color: '#91a4b4',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Reset to Defaults
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default App
