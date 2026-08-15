"use client"

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Activity, LocateFixed, Search, Settings, Star, Store } from "lucide-react";
import { StatCard } from "@/components/reusable/stat-card";
import { restaurants } from "@/lib/api_beta";
import { RestaurantMap } from "@/components/reusable/restaurant-map-admin";
import { RestaurantListItem } from "@/components/reusable/restaurant-list-item";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/reusable/theme";
import { api } from "@/lib/api";
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
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateRestaurantInput } from "@/features/auth/validations/auth.schema";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRestaurantShema } from "@/features/auth/validations/auth.schema";

export default function SuperadminDashboard() {

    const { user, isAuthenticated, logout } = useAuth();
    const { setTheme } = useTheme()
    const [isLoading, setIsLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [restaurantsList, setRestaurantsList] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    // Obtener el token de las cookies
    const getToken = () => {
      if (typeof document !== 'undefined') {
        const match = document.cookie.match(/auth_token=([^;]+)/);
        return match ? match[1] : '';
      }
      return '';
    };
    const token = getToken();

    const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createRestaurantShema as any),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  

const stats = useMemo(() => {
    const open = restaurantsList.filter((r) => r.status === "abierto" || r.status === "pending_activation").length;
    const avgRating = restaurantsList.length > 0
      ? restaurantsList.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / restaurantsList.length
      : 0;
    const orders = restaurantsList.reduce((sum, r) => sum + (Number(r.monthlyOrders) || 0), 0);
    return { open, avgRating, orders };
  }, [restaurantsList]);

   const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return restaurantsList; // 👈 Retorna el estado real
    return restaurantsList.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.address?.toLowerCase().includes(q),
    );
  }, [query, restaurantsList]);

  const onSubmit = async (data: CreateRestaurantInput) => {
  setIsLoading(true);
  setErrorMessage(null);
  setGeneratedCode(null);

  try {
    // Geocodificación: convertir dirección + ciudad a coordenadas
    let latitude = '';
    let longitude = '';

    if (data.address && data.city) {
      try {
        const searchQuery = `${data.address}, ${data.city}, Colombia`;
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
        );
        const geocodeData = await geocodeResponse.json();

        if (geocodeData && geocodeData.length > 0) {
          const { lat, lon } = geocodeData[0];
          latitude = lat;
          longitude = lon;
          console.log("Coordenadas geocodificadas:", { lat, lon, searchQuery });
        } else {
          console.warn("No se encontraron coordenadas para la dirección");
          setErrorMessage("No se pudieron encontrar coordenadas para esta dirección y ciudad. Por favor, verifica los datos.");
          setIsLoading(false);
          return;
        }
      } catch (geocodeError) {
        console.error("Error en geocodificación:", geocodeError);
        setErrorMessage("Error al obtener coordenadas. Por favor, intenta nuevamente.");
        setIsLoading(false);
        return;
      }
    }

    const apiData = {
      ...data,
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    const response = await api.createRestaurantApi(apiData, token || "");

    let codeFound = null;

   if (response?.data?.restaurant?.activation_code) {
  codeFound = response.data.restaurant.activation_code;
} else if (response?.restaurant?.activation_code) {
  codeFound = response.restaurant.activation_code;
} else if (response?.activation_code) {
  codeFound = response.activation_code;
}

    if (codeFound) {
      setGeneratedCode(codeFound);
     if (response?.data?.restaurant) {
        setRestaurantsList((prev) => [response.data.restaurant, ...prev]);
      }

      setTimeout(() => {
        reset();
      }, 100);
    } else {
      console.warn("⚠️ No se encontró la propiedad activation_code en la respuesta:", response);
    }

  } catch (error: any) {
    setErrorMessage(error.message || "Ocurrió un error inesperado al guardar.");
  } finally {
    setIsLoading(false);
  }
}


const loadRestaurants = async () => {
  if (!token) return;
  try {
    setIsFetching(true);
    const response = await api.getRestaurantsApi(token);
    console.log("=== LISTA DE RESTAURANTES RECIBIDA ===", response);

    // 🚀 AJUSTE DE MAPEOS SEGÚN EL LOG REAL:
    if (response && response.data && Array.isArray(response.data.data)) {
      // Si la API envuelve la respuesta en response.data y los registros están dentro en .data
      setRestaurantsList(response.data.data);
    } else if (response && Array.isArray(response.data)) {
      // Como respaldo, si viniera plano en la raíz de data
      setRestaurantsList(response.data);
    } else if (Array.isArray(response)) {
      // Como respaldo, si viniera el arreglo directo sin envolver
      setRestaurantsList(response);
    } else {
      setRestaurantsList([]);
    }

  } catch (error) {
    console.error("No se pudieron cargar los restaurantes reales:", error);
    setRestaurantsList([]);
  } finally {
    setIsFetching(false);
  }
};

useEffect(() => {
  if (isAuthenticated && token) {
    console.log("=== EL TOKEN YA SE CARGÓ TRAS LA RECARGA, PIDIENDO DATOS ===", token);
    loadRestaurants();
  }
}, [isAuthenticated, token])

    return (
       <div className="mx-auto flex max-w-full flex-col gap-5 px-4 py-6 lg:px-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold leading-tight text-[#fb7242]">
              Panel de Control ParceAdmin
            </h1>
            <p className="text-sm text-[#a0a4a8]">
              Ubicaciones de Restaurantes Registrados
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
      <DropdownMenuTrigger asChild className="bg-white">
        <Button variant="outline"><Settings /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Perfil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configuración
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Support</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logout}>
            Cerrar sesión
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
          <ThemeToggle />
        </div>
      </header>

      {/* Section */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Store}
          label="Restaurantes"
          value="10"
          hint="Total de restaurantes registrados"
        />
        <StatCard
          icon={Activity}
          label="Activos"
          value="8"
          hint="Total de restaurantes activos"
        />
        <StatCard
          icon={Star}
          label="Calificacion"
          value="4.6"
          hint="Total de restaurantes registrados"
        />
        <StatCard
          icon={LocateFixed}
          label="Encontrados"
          value="16.400"
          hint="Total de restaurantes encontrados"
        />
      </section>

      {/* Section Map Mapcdn*/}
      <section className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
         <Card className="order-2 flex max-h-[520px] flex-col gap-3 p-4 lg:order-1 lg:max-h-[710px] bg-[#767a7f]/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar restaurante o cocina..."
              className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
              aria-label="Buscar restaurante"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
             <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {filtered.length} ubicaciones
          </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Crear Restaurante</Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Crear Restaurante</DialogTitle>
                  <DialogDescription>
                    Crear un nuevo restaurante
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                    <Label htmlFor="name-1">Nombre del Negocio</Label>
                    <Input 
                    type="text"
                    {...register("name")}
                    placeholder="Nombre del negocio" 
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>}
                  </Field>
                  <Field>
                    <Label htmlFor="nit-rut">Nit Rut</Label>
                    <Input 
                    type="text"
                    {...register("nit_rut")}
                    placeholder="Nit Rut" 
                    />
                    {errors.nit_rut && <p className="mt-1 text-sm text-red-600">{errors.nit_rut.message as string}</p>}
                  </Field>
                  <Field>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                    type="text"
                    {...register("city")}
                    placeholder="Ciudad"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message as string}</p>}
                  </Field>
                  <Field>
                    <Label htmlFor="direccion-fisica">Dirección física del local</Label>
                    <Input
                    type="text"
                    {...register("address")}
                    placeholder="Ej: Calle 123 #45-67"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message as string}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Las coordenadas se calcularán automáticamente
                    </p>
                  </Field>
                  {errorMessage && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {errorMessage}
          </div>
        )}
                </FieldGroup>
                {generatedCode && (
      <div className="my-4 p-4 bg-green-50 border border-green-200 rounded-md text-center animate-in fade-in duration-200">
        <p className="text-sm text-green-800 font-medium">¡Restaurante Creado con Éxito!</p>
        <p className="text-xs text-gray-600 mt-1">Entrega este código al dueño del establecimiento para su activación:</p>
        <div className="mt-3 text-xl font-mono font-bold tracking-widest text-green-700 bg-white border border-green-300 p-2 rounded inline-block select-all">
          {generatedCode}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">(Haz doble clic para copiar)</p>
      </div>
    )}
                <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {generatedCode ? (
              <Button 
              type="button"
              disabled={isLoading}
              onClick={() => setGeneratedCode(null)}
              >Terminar</Button>
            ) : (
              <Button 
              type="submit"
              disabled={isLoading}
              >Registrar y generar código</Button>
            )}
          </DialogFooter>
           </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {filtered.map((r) => (
              <RestaurantListItem
                key={r.id}
                restaurant={r}
                active={r.id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No se encontraron restaurantes.
              </p>
            ) : null}
          </div>
        </Card>

        {/* Map panel */}
        <Card className="order-1 h-[420px] overflow-hidden p-0 lg:order-2 lg:h-[710px]">
          <RestaurantMap
            restaurants={restaurantsList}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRefresh={loadRestaurants}
          />
        </Card>
      </section>
    </div>
    );
}
