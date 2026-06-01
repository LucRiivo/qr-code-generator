import { useEffect, useRef } from 'react'
import QRCodeStyling, { type Options } from 'qr-code-styling'

type Props = {
  options: Options
}

export function QrPreview({ options }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const qr = new QRCodeStyling(options)
    qrRef.current = qr
    containerRef.current.innerHTML = ''
    qr.append(containerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    qrRef.current?.update(options)
  }, [options])

  return <div ref={containerRef} className="flex justify-center" />
}
