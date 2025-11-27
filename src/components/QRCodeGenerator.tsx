import { Copy, Download } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  title?: string
  subtitle?: string
}

export default function QRCodeGenerator({
  value,
  size = 256,
  title,
  subtitle,
}: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        errorCorrectionLevel: 'H',
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      } as any)
    }
  }, [value, size])

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${Date.now()}.png`
      link.click()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}

      {/* QR Code Container */}
      <div
        className="p-4 bg-white rounded-lg"
        style={{
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Value Display */}
      <div className="w-full bg-primary-light border border-primary/20 rounded-lg p-3 break-all text-center text-sm font-mono">
        {value}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-primary/20 hover:border-primary rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  )
}
