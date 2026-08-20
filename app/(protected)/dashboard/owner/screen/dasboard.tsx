import { BrandingForm } from "@/features/auth/components/branding-form";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import {
  Scan,
  Store,
  Ticket,
  MapPin,
  Power,
  Star,
  Eye,
  Search,
  MousePointerClick,
  Road,
  CalendarCheck,
  RotateCcw,
  RotateCwIcon,
  CalendarRange,
  Drumstick,
  Pencil,
  CalendarDays,
  PhoneCall,
  Clock,
  Music,
  Hamburger,
  Martini,
} from "lucide-react";
import { AdminRestaurantData } from "@/lib/api_beta";
import { StatCardOwner } from "@/components/reusable/stat-card-owner";
import { ChartAreaInteractive } from "@/components/reusable/chart-area-interactive";
import { EventsModal } from "@/features/auth/components/events-modal";

export default function Dashboard({
  restaurant,
}: {
  restaurant: AdminRestaurantData;
}) {
  const [showBranding, setShowBranding] = useState(false);
  const [showModalEvents, setShowModalEvents] = useState(false);

  const actividades = [
    {
      icon: Eye,
      iconBg: "bg-gray-200",
      iconColor: "text-gray-500",
      text: (
        <>
          24 personas vieron tu <br className="hidden sm:block" />
          restaurante
        </>
      ),
      time: "Hace 2 horas",
    },
    {
      icon: Star,
      iconBg: "bg-gray-200",
      iconColor: "text-gray-500",
      text: "Recibiste valoración 5 estrellas",
      time: "Hace 5 horas",
      quote: "Excelente servicio y la comida espectacular.",
    },
    {
      icon: CalendarCheck,
      iconBg: "bg-gray-200",
      iconColor: "text-gray-500",
      text: "Nueva reserva para 4 personas",
      time: "Ayer",
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-auto">
      <div className="flex min-h-screen w-full">
        <div className="flex min-h-screen w-full flex-1 flex-col gap-2 border border-neutral-200 bg-white p-2 md:p-5 dark:border-neutral-700 dark:bg-neutral-900">
          <header className="flex flex-col mb-3 border rounded-lg">
            <div className="h-48">
              <Map
                center={
                  restaurant.latitude && restaurant.longitude
                    ? [restaurant.longitude, restaurant.latitude]
                    : [-75.567, 6.244]
                }
                zoom={14}
                className="w-full h-full"
              >
                {restaurant.latitude && restaurant.longitude && (
                  <MapMarker
                    longitude={restaurant.longitude}
                    latitude={restaurant.latitude}
                  >
                    <MarkerContent>
                      <div className="flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg p-2">
                        <MapPin className="size-6" />
                      </div>
                    </MarkerContent>
                  </MapMarker>
                )}
              </Map>
            </div>
            <div className="rounded-b-lg px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="rounded-lg text-black flex gap-2 border border-dashed p-2 items-center mb-2">
                  <h1 className="text-3xl font-bold">{restaurant.nombre}</h1>
                  <span className="py-0.5 px-2 bg-emerald-300/20 border border-emerald-300 text-emerald-500 rounded-xl">Abierto ahora</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowBranding(true)}><Pencil /> Editar</Button>
                  <BrandingForm
                    isOpen={showBranding}
                    onClose={() => setShowBranding(false)}
                    restaurant={restaurant}
                  />
                  <Button onClick={() => setShowModalEvents(true)}><CalendarDays />Eventos</Button>
                  <EventsModal
                    isOpen={showModalEvents}
                    onClose={() => setShowModalEvents(false)}
                  />
                  <button className="p-2">
                    <Power className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-base text-gray-900 flex gap-2">
                 <MapPin /> Medellin, Antioquia
                </span>
                <span className="flex items-center gap-2">
                  {" "}
                  <Star /> 4.8 (+123 reseñas)
                </span>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 p-5 rounded-lg border">
                <h1 className="text-xl font-semibold">Recorridos de tus clientes</h1>
                <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 pt-5">
                  <StatCardOwner
                    icon={Search}
                    label="Encontrado"
                    value="865"
                    porcent="+12%"
                    hint="Total de restaurantes encontrados"
                  />
                  <StatCardOwner
                    icon={Eye}
                    label="Perfil Visto"
                    value="1,248"
                    porcent="+8%"
                    hint="Total de perfiles vistos"
                  />
                  <StatCardOwner
                    icon={MousePointerClick}
                    label="Interacciones"
                    value="423"
                    porcent="-3%"
                    hint="Total de interacciones"
                  />
                  <StatCardOwner
                    icon={Road}
                    label="Rutas iniciadas"
                    value="187"
                    porcent="+24%"
                    hint="Total de rutas iniciadas"
                  />
                </section>
              </div>
            <div className="col-span-2 rounded-lg border p-5">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-xl font-semibold">Eventos Activos</h1>
                <Ticket className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                <div className="bg-gray-100 border border-gray-300 p-2 rounded-md">
                  <Hamburger />
                </div>                
                <div>
                  <h1 className="font-semibold">2 x 1 En hamburguesas</h1>
                  <span className="text-sm text-gray-600">Promo todos los martes</span>
                </div>
              </div>   

              <div className="flex items-center gap-3">
                <div className="bg-gray-100 border border-gray-300 p-2 rounded-md">
                  <Martini />
                </div>                
                <div>
                  <h1 className="font-semibold">Cata de Vinos</h1>
                  <span className="text-sm text-gray-600">Evento • Próximo jueves</span>
                </div>
              </div>   

              <div className="flex items-center gap-3">
                <div className="bg-gray-100 border border-gray-300 p-2 rounded-md">
                  <Music />
                </div>                
                <div>
                  <h1 className="font-semibold">Jazz Night Live</h1>
                  <span className="text-sm text-gray-600">Viernes 8:00 PM</span>
                </div>
              </div>
              <div>
                <Button className="w-full bg-white border border-gray-300 text-black">Gestionar eventos</Button> 
              </div>  
              </div>  
            </div>

            <div className="col-span-3 rounded-lg border p-5">
              <h1 className="text-xl font-semibold mb-3">Rendimiento de interacciones</h1>
              <div className="flex-1">
                <ChartAreaInteractive />
              </div>
            </div>
            <div className="col-span-2 rounded-lg border p-5">
              <div className="flex justify-between mb-3">
                <h1 className="text-xl font-semibold">Actividad reciente</h1>
                <CalendarRange />
              </div>
              <div className="py-5">
                <ul>
                  {actividades.map((item, idx) => {
                    const Icon = item.icon;
                    const isLast = idx === actividades.length - 1;

                    return (
                      <li key={idx} className="flex gap-4">
                        {/* Columna icono + línea conectora */}
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
                          >
                            <Icon
                              className={`h-4 w-4 ${item.iconColor}`}
                              strokeWidth={2}
                            />
                          </span>

                          {!isLast && (
                            <span className="my-1 w-px flex-1 bg-slate-200" />
                          )}
                        </div>

                        {/* Contenido */}
                        <div
                          className={`flex-1 pt-0.5 ${isLast ? "" : "pb-6"}`}
                        >
                          <p className="text-sm font-medium leading-snug text-slate-900">
                            {item.text}
                          </p>

                          {item.quote && (
                            <blockquote className="mt-2 rounded-xl bg-indigo-50/70 px-4 py-3 text-sm italic text-slate-600">
                              "{item.quote}"
                            </blockquote>
                          )}

                          <p className="mt-1.5 text-xs text-slate-400">
                            {item.time}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mt-4 flex justify-center">
                <Button className="bg-white border text-black border-gray-300 w-full">Ver toda la actividad</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
