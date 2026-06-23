import { useMemo, useState } from 'react'
import QRCodeStyling, { type Options } from 'qr-code-styling'
import { QrPreview } from './QrPreview'

type Mode = 'link' | 'whatsapp'
type DotType = 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded'
type FileFormat = 'png' | 'svg'

function buildWhatsAppUrl(phone: string, message: string) {
  const cleaned = phone.replace(/[^\d]/g, '')
  const base = `https://wa.me/${cleaned}`
  return message.trim() ? `${base}?text=${encodeURIComponent(message)}` : base
}

export default function App() {
  const [mode, setMode] = useState<Mode>('link')
  const [link, setLink] = useState('https://example.com')
  const [phone, setPhone] = useState('15551234567')
  const [message, setMessage] = useState('')

  const [fgColor, setFgColor] = useState('#0f172a')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [dotType, setDotType] = useState<DotType>('rounded')
  const [logo, setLogo] = useState<string | undefined>(undefined)
  const [fileFormat, setFileFormat] = useState<FileFormat>('png')

  const data = useMemo(() => {
    if (mode === 'link') return link.trim() || ' '
    return buildWhatsAppUrl(phone, message)
  }, [mode, link, phone, message])

  const options: Options = useMemo(
    () => ({
      width: 440,
      height: 440,
      type: 'svg',
      data,
      margin: 16,
      // Only use max error correction when a logo punches out the center.
      // Without a logo, the lowest level keeps the grid as sparse as possible
      // → the largest, crispest modules for the given data.
      qrOptions: { errorCorrectionLevel: logo ? 'H' : 'L' },
      dotsOptions: { color: fgColor, type: dotType },
      cornersSquareOptions: { color: fgColor, type: 'extra-rounded' },
      cornersDotOptions: { color: fgColor, type: 'dot' },
      backgroundOptions: { color: bgColor },
      image: logo,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 4,
        imageSize: 0.28,
        hideBackgroundDots: true,
      },
    }),
    [data, fgColor, bgColor, dotType, logo]
  )

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDownload = () => {
    const name = mode === 'whatsapp' ? 'whatsapp-qr' : 'link-qr'
    const size = 2048
    const qr = new QRCodeStyling({
      ...options,
      width: size,
      height: size,
      margin: 32,
      type: fileFormat === 'svg' ? 'svg' : 'canvas',
    })
    qr.download({ name, extension: fileFormat })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">QR Code Generator</h1>
          <p className="text-slate-500 mt-1">Generate branded QR codes for links and WhatsApp.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-slate-200">
          <div>
            <div className="inline-flex rounded-lg bg-slate-100 p-1 mb-6">
              <button
                className={`px-4 py-1.5 text-sm rounded-md transition ${
                  mode === 'link' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'
                }`}
                onClick={() => setMode('link')}
              >
                Link
              </button>
              <button
                className={`px-4 py-1.5 text-sm rounded-md transition ${
                  mode === 'whatsapp' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'
                }`}
                onClick={() => setMode('whatsapp')}
              >
                WhatsApp
              </button>
            </div>

            {mode === 'link' ? (
              <div className="space-y-4">
                <Field label="URL">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </Field>
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="Phone number (with country code, digits only)">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="15551234567"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </Field>
                <Field label="Pre-filled message (optional)">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I'd like to know more about..."
                    rows={3}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                  />
                </Field>
                <p className="text-xs text-slate-500 break-all">
                  Resolves to: <span className="font-mono">{buildWhatsAppUrl(phone, message)}</span>
                </p>
              </div>
            )}

            <hr className="my-6 border-slate-200" />

            <h2 className="text-sm font-medium text-slate-900 mb-3">Branding</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Foreground">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-10 rounded-md border border-slate-300 cursor-pointer"
                />
              </Field>
              <Field label="Background">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 rounded-md border border-slate-300 cursor-pointer"
                />
              </Field>
              <Field label="Dot style">
                <select
                  value={dotType}
                  onChange={(e) => setDotType(e.target.value as DotType)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="square">Square</option>
                  <option value="rounded">Rounded</option>
                  <option value="dots">Dots</option>
                  <option value="classy">Classy</option>
                  <option value="extra-rounded">Extra rounded</option>
                </select>
              </Field>
              <Field label="Logo">
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm text-center text-slate-700 hover:bg-slate-50">
                    {logo ? 'Replace' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {logo && (
                    <button
                      onClick={() => setLogo(undefined)}
                      className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </Field>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-6 border border-slate-200">
            <QrPreview options={options} />
            <div className="mt-6 flex items-center gap-2">
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value as FileFormat)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
              <button
                onClick={handleDownload}
                className="px-5 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-700 mb-1">{label}</span>
      {children}
    </label>
  )
}
