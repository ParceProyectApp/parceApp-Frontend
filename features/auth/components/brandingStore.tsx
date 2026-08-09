/**
 * Restaurant Branding Store
 * Holds the user-provided restaurant name and logo shown on the building front.
 */

import { create } from 'zustand'

interface BrandingState {
  restaurantName: string
  logoUrl: string | null
  setBranding: (name: string, logoUrl: string | null) => void
}

export const useBrandingStore = create<BrandingState>((set) => ({
  restaurantName: 'My Restaurant',
  logoUrl: null,
  setBranding: (name, logoUrl) => set({ restaurantName: name, logoUrl }),
}))
