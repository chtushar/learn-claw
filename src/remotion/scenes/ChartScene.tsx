import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
} from 'remotion'
import { Audio } from '@remotion/media'
import { ProgressBar } from '../components/ProgressBar'
import { FONT_FAMILY } from '../lib/fonts'
import { theme } from '../lib/theme'
import type { ProcessedSection } from '@/lib/processedSchema'
import type { Chart, ChartItem } from '@/lib/schema'

const PALETTE = ['#2c80ff', '#106ae7', '#0c3169', '#75aafc', '#daecff', '#5a9cff']

function getColor(item: ChartItem, idx: number): string {
  return item.color || PALETTE[idx % PALETTE.length]
}

// --- Bar Chart ---
const BarChart: React.FC<{ chart: Chart; frame: number; fps: number }> = ({
  chart,
  frame,
  fps,
}) => {
  const maxValue = Math.max(...chart.items.map((item) => item.value))
  const barWidth = Math.min(120, Math.floor(800 / chart.items.length) - 20)

  return (
    <svg viewBox="0 0 900 600" width="100%" height="100%">
      {/* Baseline */}
      <line x1="50" y1="520" x2="850" y2="520" stroke={theme.border} strokeWidth="2" />

      {chart.items.map((item, i) => {
        const fullHeight = (item.value / maxValue) * 440
        const staggerDelay = 0.5 * fps + i * 0.15 * fps
        const growProgress = interpolate(
          frame,
          [staggerDelay, staggerDelay + 0.6 * fps],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
        const barHeight = fullHeight * growProgress
        const x =
          50 +
          (800 - chart.items.length * (barWidth + 20)) / 2 +
          i * (barWidth + 20) +
          10
        const y = 520 - barHeight

        const labelOpacity = interpolate(
          frame,
          [staggerDelay + 0.4 * fps, staggerDelay + 0.7 * fps],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={8}
              fill={getColor(item, i)}
            />
            {/* Value label */}
            <text
              x={x + barWidth / 2}
              y={y - 12}
              textAnchor="middle"
              fontSize="20"
              fontWeight="700"
              fill={theme.text}
              opacity={labelOpacity}
            >
              {item.value}
            </text>
            {/* Category label */}
            <text
              x={x + barWidth / 2}
              y={548}
              textAnchor="middle"
              fontSize="16"
              fill={theme.textMuted}
              opacity={labelOpacity}
            >
              {item.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// --- Pie Chart ---
const PieChart: React.FC<{ chart: Chart; frame: number; fps: number }> = ({
  chart,
  frame,
  fps,
}) => {
  const total = chart.items.reduce((sum, item) => sum + item.value, 0)
  const cx = 450
  const cy = 300
  const r = 220

  const sweepProgress = interpolate(
    frame,
    [0.5 * fps, 1.5 * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  let accAngle = -Math.PI / 2
  const slices = chart.items.map((item, i) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI
    const animatedAngle = sliceAngle * sweepProgress
    const startAngle = accAngle
    const endAngle = startAngle + animatedAngle
    accAngle += sliceAngle

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = animatedAngle > Math.PI ? 1 : 0

    const midAngle = startAngle + animatedAngle / 2
    const labelR = r + 36
    const lx = cx + labelR * Math.cos(midAngle)
    const ly = cy + labelR * Math.sin(midAngle)

    const labelOpacity = interpolate(
      frame,
      [1.5 * fps, 2.0 * fps],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    )

    const d =
      animatedAngle > 0.001
        ? `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
        : ''

    return (
      <g key={i}>
        {d && <path d={d} fill={getColor(item, i)} />}
        <text
          x={lx}
          y={ly}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="16"
          fontWeight="600"
          fill={theme.text}
          opacity={labelOpacity}
        >
          {item.label}
        </text>
      </g>
    )
  })

  return (
    <svg viewBox="0 0 900 600" width="100%" height="100%">
      {slices}
    </svg>
  )
}

// --- Comparison Chart (horizontal bars) ---
const ComparisonChart: React.FC<{
  chart: Chart
  frame: number
  fps: number
}> = ({ chart, frame, fps }) => {
  const maxValue = Math.max(...chart.items.map((item) => item.value))
  const barHeight = Math.min(60, Math.floor(500 / chart.items.length) - 16)
  const maxBarWidth = 600

  return (
    <svg viewBox="0 0 900 600" width="100%" height="100%">
      {chart.items.map((item, i) => {
        const fullWidth = (item.value / maxValue) * maxBarWidth
        const staggerDelay = 0.5 * fps + i * 0.15 * fps
        const growProgress = interpolate(
          frame,
          [staggerDelay, staggerDelay + 0.6 * fps],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
        const barW = fullWidth * growProgress
        const y = 40 + i * (barHeight + 16)

        const labelOpacity = interpolate(
          frame,
          [staggerDelay + 0.3 * fps, staggerDelay + 0.6 * fps],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )

        return (
          <g key={i}>
            {/* Label */}
            <text
              x={180}
              y={y + barHeight / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontSize="18"
              fill={theme.text}
              fontWeight="500"
              opacity={labelOpacity}
            >
              {item.label}
            </text>
            {/* Bar */}
            <rect
              x={200}
              y={y}
              width={barW}
              height={barHeight}
              rx={8}
              fill={getColor(item, i)}
            />
            {/* Value */}
            <text
              x={200 + barW + 12}
              y={y + barHeight / 2}
              dominantBaseline="central"
              fontSize="18"
              fontWeight="700"
              fill={theme.text}
              opacity={labelOpacity}
            >
              {item.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// --- Main ChartScene ---
export const ChartScene: React.FC<{
  section: ProcessedSection
  index: number
  total: number
  audioSrc?: string
}> = ({ section, index, total, audioSrc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const chart = section.chart
  if (!chart) return null

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [0, 0.5 * fps], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const ChartComponent =
    chart.type === 'pie'
      ? PieChart
      : chart.type === 'comparison'
        ? ComparisonChart
        : BarChart

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.background,
        padding: '36px 32px',
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {audioSrc && <Audio src={audioSrc} />}

      <ProgressBar current={index + 1} total={total} />

      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginTop: 16,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 28 }}>{section.iconEmoji}</span>
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: theme.text,
            letterSpacing: -0.5,
          }}
        >
          {chart.title || section.title}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
          padding: '0 16px',
        }}
      >
        <ChartComponent chart={chart} frame={frame} fps={fps} />
      </div>

      {chart.caption && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [1.7 * fps, 2.2 * fps],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            ),
            fontSize: 16,
            color: theme.captionText,
            textAlign: 'center',
            fontWeight: 500,
            paddingTop: 8,
          }}
        >
          {chart.caption}
        </div>
      )}
    </AbsoluteFill>
  )
}
