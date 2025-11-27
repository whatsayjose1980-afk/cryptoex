import { useLocation } from 'wouter'

interface LogoButtonProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  clickable?: boolean
}

export default function LogoButton({
  size = 'md',
  className = '',
  clickable = true,
}: LogoButtonProps) {
  const [, setLocation] = useLocation()

  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-16 w-auto',
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
      <img
        src="/cryptoex-logo-inline.png"
        alt="CryptoEx"
        className={`${sizeClasses[size]}`}
      />
    </button>
  )
}
