"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Clock, Phone, MapPin, UtensilsCrossed } from "lucide-react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  type MapRef,
} from "@/components/ui/map";
import { cn } from "@/lib/utils/cn";
import { statusConfig } from "@/lib/api_beta";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { api } from "@/lib/api";

type RestaurantMapProps = {
  restaurants: any[]; // 🚀 Cambiado a any[] para evitar conflictos de tipado con Supabase
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRefresh?: () => void;
};

export function RestaurantMap({
  restaurants,
  selectedId,
  onSelect,
  onRefresh,
}: RestaurantMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [ready, setReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [restaurantToEdit, setRestaurantToEdit] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

      const getToken = () => {
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/auth_token=([^;]+)/);
        return match ? match[1] : '';
      }
      return '';
    };
    const token = getToken();

  // edit handle
  const handleEdit = (restaurant: any) => {
    setRestaurantToEdit(restaurant);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (restaurant: any) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el restaurante "${restaurant.name}"?`)) {
      return;
    }

    try {
      setIsLoading(true);
      await api.deleteRestaurantApi(restaurant.id, token || "");
      console.log("¡Restaurante eliminado con éxito!");
      
      // Recargar la lista de restaurantes
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleEditSubmit llamado");

    if (!restaurantToEdit) {
      console.log("restaurantToEdit es null");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("Datos del formulario:", data);
    console.log("ID del restaurante:", restaurantToEdit.id);
    console.log("Token:", token ? "Presente" : "Ausente");

    try {
      setIsLoading(true);

      // Geocodificación: convertir dirección + ciudad a coordenadas
      const address = data.address as string;
      const city = data.city as string;
      if (address && city) {
        try {
          const searchQuery = `${address}, ${city}, Colombia`;
          const geocodeResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
          );
          const geocodeData = await geocodeResponse.json();

          if (geocodeData && geocodeData.length > 0) {
            const { lat, lon } = geocodeData[0];
            data.latitude = lat;
            data.longitude = lon;
            console.log("Coordenadas geocodificadas:", { lat, lon, searchQuery });
          } else {
            console.warn("No se encontraron coordenadas para la dirección y ciudad");
            // Si no se encuentran coordenadas, mantener las existentes
            data.latitude = restaurantToEdit.latitude?.toString() || '';
            data.longitude = restaurantToEdit.longitude?.toString() || '';
          }
        } catch (geocodeError) {
          console.error("Error en geocodificación:", geocodeError);
          // En caso de error, mantener las coordenadas existentes
          data.latitude = restaurantToEdit.latitude?.toString() || '';
          data.longitude = restaurantToEdit.longitude?.toString() || '';
        }
      }

      const response = await api.updateRestaurantApi(restaurantToEdit.id, data, token || "");

      console.log("Respuesta de la API:", response);

      setIsLoading(false);
      setIsModalOpen(false);
      setRestaurantToEdit(null);
      console.log("¡Restaurante actualizado con éxito!");

      // Recargar la lista de restaurantes
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setIsLoading(false);
    }
  }

  // Fly to selected restaurant
  useEffect(() => {
    if (!ready || !selectedId || !restaurants) return;
    const target = restaurants.find((r) => r.id === selectedId);
    if (!target || !mapRef.current) return;

    // Aseguramos que existan coordenadas válidas antes de mover el mapa
    if (
      typeof target.longitude === "number" &&
      typeof target.latitude === "number"
    ) {
      mapRef.current.flyTo({
        center: [target.longitude, target.latitude],
        zoom: 14,
        duration: 900,
      });
    }
  }, [selectedId, ready, restaurants]);

  return (
    <>
      <Map
        ref={mapRef}
        center={[-75.567, 6.244]} // 💡 Opcional: Ajusta al centro por defecto de tu ciudad (ej. Medellín)
        zoom={12.4}
        className="h-full w-full"
        onViewportChange={() => setReady(true)}
      >
        <MapControls />
        {restaurants?.map((r) => {
          // 🚀 Resguardo seguro por si viene 'pending_activation'
          const currentStatus = r.status || "pending_activation";
          const status = statusConfig[currentStatus] || {
            label: "Pendiente",
            badge: "bg-amber-500",
            dot: "bg-amber-500",
          };

          const isActive = r.id === selectedId;

          // Validaciones de seguridad para datos opcionales de la DB
          const displayRating =
            typeof r.rating === "number" ? r.rating.toFixed(1) : "0.0";
          const displayReviews =
            typeof r.reviews === "number"
              ? r.reviews.toLocaleString("es-MX")
              : "0";

          // Forzar conversión a número por seguridad
          const lng = Number(r.longitude);
          const lat = Number(r.latitude);

          if (isNaN(lng) || isNaN(lat)) return null; // Si no tiene coordenadas válidas, no lo dibuja en el mapa

          return (
            <MapMarker
              key={r.id}
              longitude={lng}
              latitude={lat}
              onClick={() => onSelect(r.id)}
            >
              <MarkerContent>
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 border-background shadow-lg transition-all",
                    isActive
                      ? "size-9 bg-primary text-primary-foreground ring-2 ring-primary/40"
                      : "size-7 bg-primary/90 text-primary-foreground hover:size-8",
                  )}
                >
                  <UtensilsCrossed className={isActive ? "size-4" : "size-3.5"} />
                </div>
              </MarkerContent>
              <MarkerPopup closeButton offset={20}>
                <div className="w-auto px-5 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold leading-tight">
                        {r.name || "Sin nombre"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.cuisine || "Cocina"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <Star className="size-3.5 fill-primary text-primary" />
                    <span className="font-medium">{displayRating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({displayReviews} reseñas)
                    </span>
                    <span className="ml-auto text-xs font-medium text-muted-foreground">
                      {r.priceRange || "$$"}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1.5 border-t border-border pt-2 text-xs text-muted-foreground">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      {r.address || "Sin dirección"}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="size-3.5 shrink-0" />
                      {r.hours || "Horario no disponible"}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="size-3.5 shrink-0" />
                      {r.phone || "Teléfono no disponible"}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center content-center justify-center gap-2">
                    <Button onClick={() => handleEdit(r)}>Editar</Button>
                    <Button 
                      className="w-20" 
                      variant="destructive"
                      onClick={() => handleDelete(r)}
                      disabled={isLoading}
                    >
                      Desactivar
                    </Button>
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}
      </Map>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Editar restaurante</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Field>
                  <Label htmlFor="name-1">Nombre del Negocio</Label>
                  <Input
                    name="name"
                    placeholder="Nombre del negocio"
                    defaultValue={restaurantToEdit?.name}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="nit-rut">Nit Rut</Label>
                  <Input
                    name="nit_rut"
                    placeholder="Nit Rut"
                    defaultValue={restaurantToEdit?.nit_rut}
                    disabled
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="city">
                    Ciudad
                  </Label>
                  <Input
                    name="city"
                    placeholder="Medellín"
                    defaultValue={restaurantToEdit?.city}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="direccion-fisica">
                    Dirección física del local
                  </Label>
                  <Input
                    name="address"
                    placeholder="Ej: Calle 123 #45-67"
                    defaultValue={restaurantToEdit?.address}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Las coordenadas se calcularán automáticamente
                  </p>
                </Field>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="default">Cancel</Button>
              </DialogClose>
              <Button variant="default" type="submit" disabled={isLoading}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
