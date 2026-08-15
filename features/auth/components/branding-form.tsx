'use client'

import { useRef, useState, useEffect } from 'react'
import { useBrandingStore } from './brandingStore'
import { AdminRestaurantData } from '@/lib/api_beta'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface BrandingFormProps {
  isOpen: boolean
  onClose: () => void
  restaurant: AdminRestaurantData
}

export function BrandingForm({ isOpen, onClose, restaurant }: BrandingFormProps) {
  const { setBranding } = useBrandingStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [rut, setRut] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync local state when the panel opens
  useEffect(() => {
    if (isOpen) {
      setName(restaurant.nombre || '')
      setDescription(restaurant.description || '')
      setAddress(restaurant.direccion || '')
      setRut(restaurant.nit || '')
      setLogo(null)
      setError(null)
    }
  }, [isOpen, restaurant])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Obtener el token de las cookies
    const getToken = () => {
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/auth_token=([^;]+)/);
        return match ? match[1] : '';
      }
      return '';
    };
    const token = getToken();

    try {
      const updateData = {
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        nit_rut: rut.trim(),
      };

      const response = await api.updateMyRestaurantApi(updateData, token || "");

      console.log('Restaurante actualizado exitosamente:', response);

      // Actualizar el branding store
      setBranding(name.trim() || 'My Restaurant', logo);

      // Cerrar el formulario
      onClose();

      // Recargar la página para actualizar los datos
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error: any) {
      console.error('Error al actualizar restaurante:', error);
      setError(error.message || 'Error al actualizar los datos del restaurante');
    } finally {
      setIsLoading(false);
    }
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
        className="relative w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-ana-soft-gray overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ana-soft-gray">
          <h2 id="branding-title" className="text-lg font-semibold text-ana-dark">
            Datos de tu local
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
              Nombre del negocio
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="restaurant-description" className="text-sm font-medium text-ana-dark">
              Descripcion
            </label>
            <input
              id="restaurant-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Restaurante de comida japonesa"
              maxLength={100}
              className="w-full px-3 py-2.5 rounded-lg border border-ana-soft-gray text-ana-dark placeholder:text-ana-dark/40 focus:outline-none focus:ring-2 focus:ring-ana-blue focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="restaurant-address" className="text-sm font-medium text-ana-dark">
              Direccion del negocio
            </label>
            <input
              id="restaurant-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Calle 123 #45-67"
              maxLength={100}
              className="w-full px-3 py-2.5 rounded-lg border border-ana-soft-gray text-ana-dark placeholder:text-ana-dark/40 focus:outline-none focus:ring-2 focus:ring-ana-blue focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="restaurant-rut" className="text-sm font-medium text-ana-dark">
              Rut del negocio
            </label>
            <input
              id="restaurant-rut"
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              placeholder="e.g. 12.345.678-9"
              maxLength={20}
              className="w-full px-3 py-2.5 rounded-lg border border-ana-soft-gray text-ana-dark placeholder:text-ana-dark/40 focus:outline-none focus:ring-2 focus:ring-ana-blue focus:border-transparent"
            />
          </div>

          {/* Logo */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="default"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
