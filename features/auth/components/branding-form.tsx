'use client'

import { useRef, useState, useEffect } from 'react'
import { useBrandingStore } from './brandingStore'

interface BrandingFormProps {
  isOpen: boolean
  onClose: () => void
}

export function BrandingForm({ isOpen, onClose }: BrandingFormProps) {
  const { restaurantName, logoUrl, setBranding } = useBrandingStore()
  const [name, setName] = useState(restaurantName)
  const [logo, setLogo] = useState<string | null>(logoUrl)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync local state when the panel opens
  useEffect(() => {
    if (isOpen) {
      setName(restaurantName)
      setLogo(logoUrl)
      setError(null)
    }
  }, [isOpen, restaurantName, logoUrl])

  if (!isOpen) return null

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setLogo(reader.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBranding(name.trim() || 'My Restaurant', logo)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ana-dark/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="branding-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-ana-soft-gray overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ana-soft-gray">
          <h2 id="branding-title" className="text-lg font-semibold text-ana-dark">
            Restaurant Branding
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-ana-dark/60 hover:bg-ana-soft-gray/60 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="restaurant-name" className="text-sm font-medium text-ana-dark">
              Restaurant name
            </label>
            <input
              id="restaurant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sakura Grill"
              maxLength={28}
              className="w-full px-3 py-2.5 rounded-lg border border-ana-soft-gray text-ana-dark placeholder:text-ana-dark/40 focus:outline-none focus:ring-2 focus:ring-ana-blue focus:border-transparent"
            />
          </div>

          {/* Logo */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ana-dark">Logo</span>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-dashed border-ana-soft-gray bg-ana-sky/40 flex items-center justify-center overflow-hidden shrink-0">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo || "/placeholder.svg"} alt="Logo preview" className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-7 h-7 text-ana-dark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFile(file)
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 text-sm font-medium rounded-lg bg-ana-blue text-white hover:bg-ana-blue/90 transition-colors"
                >
                  Upload image
                </button>
                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo(null)}
                    className="px-3 py-2 text-sm font-medium rounded-lg border border-ana-soft-gray text-ana-dark/70 hover:bg-ana-soft-gray/50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-ana-soft-gray text-ana-dark/70 hover:bg-ana-soft-gray/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-ana-blue to-ana-light-blue text-white shadow-md hover:shadow-lg transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
