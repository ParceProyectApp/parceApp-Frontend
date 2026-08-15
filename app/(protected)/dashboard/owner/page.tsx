"use client";

import { ThemeToggle } from "@/components/reusable/theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AlertCircle, BadgeCheck, CalendarRange, CheckCircle2, FileText, HelpCircle, KeyRound, LayoutDashboard, LogOut, MapPin, Search, Settings, Store, UtensilsCrossed } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useState, useEffect } from 'react'
import { ActivationScreen } from '@/features/auth/components/activation-screen'
import { OwnerDashboardContent } from './dashboard'
import { api } from '@/lib/api'
import { AdminRestaurantData } from '@/lib/api_beta'
import { useBrandingStore } from '@/features/auth/components/brandingStore';

export default function OwnerDashboard() {
  const [restaurant, setRestaurant] = useState<AdminRestaurantData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { initializeFromRestaurant } = useBrandingStore()

  const getToken = () => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/auth_token=([^;]+)/);
      return match ? match[1] : '';
    }
    return '';
  };
  const token = getToken();

  useEffect(() => {
    const checkExistingRestaurant = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await api.getMyRestaurantApi(token)
        const restaurantData: AdminRestaurantData = {
          id: res.data?.id,
          code: res.data?.activation_code || '',
          nombre: res.data?.name || '',
          nit: res.data?.nit_rut || '',
          pais: res.data?.country || 'Colombia',
          ciudad: res.data?.city || '',
          direccion: res.data?.address || '',
          description: res.data?.description || '',
          latitude: res.data?.latitude || 0,
          longitude: res.data?.longitude || 0,
          createdBy: 'admin@parce.app',
          createdAt: new Date().toLocaleDateString(),
        }
        setRestaurant(restaurantData)
        // Inicializar el branding store con el nombre del restaurante
        if (restaurantData.nombre) {
          initializeFromRestaurant(restaurantData.nombre)
        }
      } catch (error) {
        // No tiene restaurante activo, mostrar pantalla de activación
        console.log('No se encontró restaurante activo')
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingRestaurant()
  }, [token, initializeFromRestaurant])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return <ActivationScreen onActivate={setRestaurant} />
  }

  return <OwnerDashboardContent restaurant={restaurant} onLogout={() => setRestaurant(null)} />
}
