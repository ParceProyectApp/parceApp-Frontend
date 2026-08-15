import { BrandingForm } from "@/features/auth/components/branding-form";
import { CargoMenu } from "@/features/auth/components/cargo-menu";
import { warehouses } from "@/features/auth/components/mock-data";
import { WarehouseLayoutPanel } from "@/features/auth/components/warehouse-layout";
import { WarehouseInventoryProvider } from "@/features/auth/components/warehouse-inventory";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { Scan, Store, Ticket, MapPin } from "lucide-react";
import { AdminRestaurantData } from "@/lib/api_beta";

const WarehouseScene = dynamic(
  () => import('@/features/auth/components/warehouse-scene').then(mod => ({ default: mod.WarehouseScene })),
  { ssr: false }
)

function LoadingFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-ana-sky to-white">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-ana-blue border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-ana-dark font-medium">Loading 3D Cargo Management System...</p>
      </div>
    </div>
  )
}

export default function Dashboard({ restaurant }: { restaurant: AdminRestaurantData }) {
  const [activeWarehouseLayout, setActiveWarehouseLayout] = useState<string | null>(null)
  const [showCargoMenu, setShowCargoMenu] = useState(false)
  const [showBranding, setShowBranding] = useState(false)

  const activeWarehouse = activeWarehouseLayout ? warehouses.find(w => w.id === activeWarehouseLayout) : null

  return (
    <WarehouseInventoryProvider>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-5 dark:border-neutral-700 dark:bg-neutral-900">
         <header className="z-10 bg-gray-200 dark:bg-neutral-800 rounded-md backdrop-blur-sm border-b border-ana-soft-gray">
          <div className="max-w-full mx-auto px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={() => setShowBranding(true)}
                className=""
              >
                <Store />
                Mi tienda
              </Button>

              <div id="warehouse-buttons" className="flex items-center rounded-xl p-1">
                <Button
                  variant="default"
                  onClick={() => setActiveWarehouseLayout('warehouse-1')}
                  className=""
                >
                  <div className="w-6 h-6 rounded-md bg-ana-blue/10 group-hover:bg-ana-blue flex items-center justify-center transition-colors">
                    <Scan />
                  </div>
                  <span>Almacén 1</span>
                </Button>
              </div>

              <Button
                variant="default"
                id="cargo-tracking-btn"
                onClick={() => setShowCargoMenu(true)}
                className=""
              >
                <Ticket />
                Eventos
              </Button>
            </div>

            <div id="live-status" className="flex items-center gap-6">
              <div className="flex gap-3">
                <p className="text-base font-semibold text-ana-dark/60">Estado:</p>
                <p className="text-base font-medium text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Abierto
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-5 grid-rows-5 gap-4 h-full">
          <div className="col-span-3 row-span-5 h-full">
            <Suspense fallback={<LoadingFallback />}>
              <div className="relative flex-1 w-full h-full min-h-0">
                <WarehouseScene onOpenWarehouseLayout={setActiveWarehouseLayout} />
              </div>
            </Suspense>
            <CargoMenu isOpen={showCargoMenu} onClose={() => setShowCargoMenu(false)} />
          {activeWarehouse && (
          <WarehouseLayoutPanel
            data={activeWarehouse}
            onClose={() => setActiveWarehouseLayout(null)}
          />
        )}
        <BrandingForm isOpen={showBranding} onClose={() => setShowBranding(false)} restaurant={restaurant} />
          </div>
          <div className="col-span-2 row-span-3 col-start-4">
            <div className="w-full h-full">
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
          </div>
          <div className="col-span-2 row-span-2 col-start-4 row-start-4 grid grid-cols-2 grid-rows-2 gap-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Perfil visto:</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">1</span>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurante Encontrado:</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">1</span>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurante en opciones:</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">1</span>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 flex items-center justify-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurante analisado:</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">1</span>
            </div>
          </div>
        </div>
       </div>
      </div>
    </WarehouseInventoryProvider>
  );
}