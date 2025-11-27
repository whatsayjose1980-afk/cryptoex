import { isImageIcon, getInlineIcon, getDisplayIcon } from '../utils/tokenConfig'

interface TokenIconProps {
  symbol: string
  size?: 'inline' | 'small' | 'medium' | 'large'
  className?: string
}

export default function TokenIcon({ symbol, size = 'inline', className = '' }: TokenIconProps) {
  const inlineIcon = getInlineIcon(symbol)
  const displayIcon = getDisplayIcon(symbol)
  const isImage = isImageIcon(inlineIcon)

  // Determine which icon to use and size
  const icon = size === 'inline' ? inlineIcon : displayIcon
  const isImageToUse = isImageIcon(icon)

  // Size classes
  const sizeClasses = {
    inline: 'w-5 h-5',
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  if (isImageToUse) {
    return (
      <img
        src={icon}
        alt={symbol}
        className={`${sizeClasses[size]} inline-block align-text-bottom ${className}`}
      />
    )
  }

  // Emoji icon
  const emojiSizes = {
    inline: 'text-base',
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl',
  }

  return (
    <span className={`inline-block align-text-bottom ${emojiSizes[size]} ${className}`}>
      {icon}
    </span>
  )
}
