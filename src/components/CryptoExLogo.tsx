import { useLocation } from 'wouter'

interface CryptoExLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  clickable?: boolean
}

export default function CryptoExLogo({
  size = 'md',
  className = '',
  clickable = true,
}: CryptoExLogoProps) {
  const [, setLocation] = useLocation()

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const handleClick = () => {
    if (clickable) {
      setLocation('/')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'} ${className}`}
      title="Go to Home"
      type="button"
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]}`}
      >
        <defs>
          <linearGradient id="cryptoex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#0088FF" stopOpacity="1" />
          </linearGradient>
          <filter id="cryptoex-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Crown on right side */}
        <g filter="url(#cryptoex-glow)">
          {/* Crown base */}
          <path
            d="M 70 35 L 75 45 L 80 40 L 85 50 L 90 40 L 95 45 L 90 35 Z"
            fill="url(#cryptoex-grad)"
            stroke="#00FFFF"
            strokeWidth="0.8"
          />
          {/* Crown sphere */}
          <circle cx="82.5" cy="28" r="4" fill="url(#cryptoex-grad)" stroke="#00FFFF" strokeWidth="0.6" />
        </g>

        {/* Simplified text "C" and "X" */}
        <g filter="url(#cryptoex-glow)">
          {/* Letter C */}
          <text
            x="15"
            y="60"
            fontSize="32"
            fontWeight="bold"
            fill="url(#cryptoex-grad)"
            stroke="#00FFFF"
            strokeWidth="0.3"
            fontFamily="Arial, sans-serif"
          >
            C
          </text>
          {/* Letter X */}
          <text
            x="65"
            y="60"
            fontSize="32"
            fontWeight="bold"
            fill="url(#cryptoex-grad)"
            stroke="#00FFFF"
            strokeWidth="0.3"
            fontFamily="Arial, sans-serif"
          >
            X
          </text>
        </g>

        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="url(#cryptoex-grad)"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
    </button>
  )
}
