"use client"

import { DEMO_RESTAURANTS, type AdminRestaurantData } from "@/lib/api_beta";
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Store, KeyRound, ArrowRight, HelpCircle, ShieldCheck } from "lucide-react"
import { useAuth } from "../hooks/useAuth";
import { api } from "@/lib/api";



export function ActivationScreen({
    onActivate,
}: {
    onActivate: (data: AdminRestaurantData) => void;
}) {
    const [code, setCode] = useState('')
    const [loading, setIsloading ] = useState(false)

    const getToken = () => {
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/auth_token=([^;]+)/);
        return match ? match[1] : '';
      }
      return '';
    };
    const token = getToken();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.toUpperCase().trim()
    if (fullCode.length !== 6) {
      alert("Ingresa los 6 caracteres del código de activación.")
      return
    }
    const finalCode = `PRC-${fullCode}`

    try {
      setIsloading(true)
      const res = await api.claimRestaurantApi(finalCode, token)

      console.log('Respuesta del backend:', res);

      // Convertir la respuesta del backend al formato esperado
      const restaurantData: AdminRestaurantData = {
        code: finalCode,
        nombre: res.restaurant?.name || 'Restaurante',
        nit: res.restaurant?.nit_rut || '',
        pais: res.restaurant?.country || 'Colombia',
        ciudad: res.restaurant?.city || '',
        direccion: res.restaurant?.address || '',
        createdBy: 'admin@parce.app',
        createdAt: new Date().toLocaleDateString(),
      }

      onActivate(restaurantData)

    } catch (error: any) {
      console.error('Error en activación:', error);
      alert(error.message || "Código inválido o ya utilizado.")
    } finally {
      setIsloading(false)
    }
  }


    return (
         <main className="flex min-h-svh flex-col lg:flex-row">
      {/* Panel de marca */}
      <section className="relative hidden overflow-hidden bg-sidebar lg:flex lg:w-[44%] lg:flex-col">
        <Image
          src="/images/restaurant-warm.png"
          alt=""
          fill
          priority
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/70 to-sidebar/30" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Mesa</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-balance text-4xl font-bold leading-tight text-sidebar-foreground">
              Tu restaurante, listo para operar.
            </h1>
            <p className="mt-4 text-pretty leading-relaxed text-sidebar-foreground/70">
              Activa tu cuenta con el código que te entregó el administrador y
              completa el perfil de tu negocio en minutos.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-sidebar-foreground/80">
              {[
                'Datos de tu negocio ya registrados',
                'Completa tu perfil paso a paso',
                'Empieza a gestionar tus mesas',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <ShieldCheck className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-sidebar-foreground/50">
            © 2026 Mesa. Panel del dueño del restaurante.
          </p>
        </div>
      </section>

      {/* Panel de activación */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Mesa</span>
          </div>

          <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <KeyRound className="size-6" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Activa tu restaurante
          </h2>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Ingresa el código de activación que recibiste del administrador para
            acceder al panel de tu negocio.
          </p>

          <form onSubmit={handleClaim} className="mt-8">
            <Label htmlFor="code-0" className="text-sm font-medium">
              Código de activación
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-14 items-center rounded-lg border border-input bg-muted px-4 font-mono text-lg font-semibold text-muted-foreground">
                PRC
              </div>
              <span className="text-xl font-semibold text-muted-foreground">-</span>
              <Input
                type="text"
                placeholder="064C69"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center font-mono text-lg tracking-widest uppercase"
                required
                disabled={loading}
                maxLength={6}
              />
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verificando…
                </>
              ) : (
                <>
                  Activar y entrar
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            <HelpCircle className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="leading-relaxed">
              ¿No tienes un código? Solicítalo al administrador que creó tu
              restaurante. Para probar, usa{' '}
              <button
                type="button"
                onClick={() => setCode('064C69')}
                className="font-mono font-semibold text-foreground underline underline-offset-2"
              >
                PRC-064C69
              </button>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
    )
}
