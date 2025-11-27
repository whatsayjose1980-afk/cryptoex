import { useState } from 'react'

interface Candle {
  time: string
  open: number
  high: number
  low: number
  close: number
}

interface CandlestickChartProps {
  data: Candle[]
  width?: number
  height?: number
}

export default function CandlestickChart({ data, width = 600, height = 300 }: CandlestickChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-dark/50 rounded-lg">
        <p className="text-gray-400">No chart data available</p>
      </div>
    )
  }

  // Calculate min and max for scaling
  const allPrices = data.flatMap((c) => [c.open, c.high, c.low, c.close])
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const priceRange = maxPrice - minPrice || 1

  // Chart dimensions
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  const candleWidth = chartWidth / (data.length * 1.5)
  const candleSpacing = candleWidth * 1.5

  // Scale functions
  const scaleY = (price: number) => {
    return height - padding - ((price - minPrice) / priceRange) * chartHeight
  }

  const scaleX = (index: number) => {
    return padding + index * candleSpacing + candleSpacing / 2
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="bg-primary-dark/50 rounded-lg"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = height - padding - chartHeight * ratio
          const price = minPrice + priceRange * ratio
          return (
            <g key={`grid-${i}`}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#00FFFF"
                strokeWidth="0.5"
                opacity="0.1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                fontSize="12"
                fill="#888"
                textAnchor="end"
              >
                ${price.toFixed(0)}
              </text>
            </g>
          )
        })}

        {/* X-axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#00FFFF"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = scaleX(index)
          const yOpen = scaleY(candle.open)
          const yClose = scaleY(candle.close)
          const yHigh = scaleY(candle.high)
          const yLow = scaleY(candle.low)

          const isGreen = candle.close >= candle.open
          const color = isGreen ? '#00FF00' : '#FF0000'
          const bodyTop = Math.min(yOpen, yClose)
          const bodyHeight = Math.abs(yClose - yOpen) || 1

          const isHovered = hoveredIndex === index

          return (
            <g
              key={`candle-${index}`}
              onMouseEnter={() => setHoveredIndex(index)}
              className="cursor-pointer"
            >
              {/* Wick (high-low line) */}
              <line
                x1={x}
                y1={yHigh}
                x2={x}
                y2={yLow}
                stroke={color}
                strokeWidth="1"
                opacity={isHovered ? 1 : 0.6}
              />

              {/* Body (open-close rectangle) */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={color}
                stroke={color}
                strokeWidth="1"
                opacity={isHovered ? 1 : 0.7}
              />

              {/* Tooltip on hover */}
              {isHovered && (
                <g>
                  {/* Background */}
                  <rect
                    x={x - 50}
                    y={bodyTop - 80}
                    width="100"
                    height="70"
                    fill="#1a1f3a"
                    stroke="#00FFFF"
                    strokeWidth="1"
                    rx="4"
                  />
                  {/* Text */}
                  <text
                    x={x}
                    y={bodyTop - 60}
                    fontSize="11"
                    fill="#00FFFF"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {candle.time}
                  </text>
                  <text
                    x={x}
                    y={bodyTop - 45}
                    fontSize="10"
                    fill="#888"
                    textAnchor="middle"
                  >
                    O: ${candle.open.toFixed(2)}
                  </text>
                  <text
                    x={x}
                    y={bodyTop - 32}
                    fontSize="10"
                    fill="#888"
                    textAnchor="middle"
                  >
                    H: ${candle.high.toFixed(2)}
                  </text>
                  <text
                    x={x}
                    y={bodyTop - 19}
                    fontSize="10"
                    fill="#888"
                    textAnchor="middle"
                  >
                    L: ${candle.low.toFixed(2)}
                  </text>
                  <text
                    x={x}
                    y={bodyTop - 6}
                    fontSize="10"
                    fill={color}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    C: ${candle.close.toFixed(2)}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Y-axis label */}
        <text
          x="15"
          y="20"
          fontSize="12"
          fill="#888"
          textAnchor="middle"
        >
          Price
        </text>
      </svg>
    </div>
  )
}
