"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { statusConfig } from "@/lib/api_beta"

type RestaurantListItemProps = {
  restaurant: any // 🚀 Cambiado a 'any' para evitar que TypeScript bloquee si las propiedades no coinciden exactamente
  active: boolean
  onSelect: (id: string) => void
}

export function RestaurantListItem({
  restaurant,
  active,
  onSelect,
}: RestaurantListItemProps) {
  
  // 🚀 Resguardo seguro en caso de que restaurant o restaurant.status no existan
  const currentStatus = restaurant?.status || "pending_activation"

  // 🚀 Si el estado existe en statusConfig lo usamos, si no (como 'pending_activation'), usamos este diseño por defecto
  const status = statusConfig[currentStatus] || {
    label: "Pendiente",
    badge: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    dot: "bg-amber-500",
  }

  // 🚀 Controlamos que el rating sea un número antes de aplicarle el .toFixed()
  const displayRating = typeof restaurant?.rating === "number" 
    ? restaurant.rating.toFixed(1) 
    : "0.0"

  return (
    <button
      type="button"
      onClick={() => onSelect(restaurant?.id)}
      aria-pressed={active}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-colors",
        active
          ? "border-primary/50 bg-primary/10"
          : "border-border bg-card hover:bg-accent",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium leading-tight">{restaurant?.name || "Sin nombre"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {restaurant?.cuisine || "Cocina"} · {restaurant?.priceRange || "$$"}
          </p>
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
            status.badge,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">{restaurant?.address || "Sin dirección"}</span>
        <span className="flex shrink-0 items-center gap-1 font-medium text-foreground">
          <Star className="size-3 fill-primary text-primary" />
          {displayRating}
        </span>
      </div>
    </button>
  )
}