export type RestaurantStatus = "abierto" | "cerrado" | "proximamente"

export type Restaurant = {
  id: string
  name: string
  cuisine: string
  address: string
  city: string
  longitude: number
  latitude: number
  rating: number
  reviews: number
  priceRange: "$" | "$$" | "$$$" | "$$$$"
  status: RestaurantStatus
  hours: string
  phone: string
  monthlyOrders: number
}

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "La Parrilla del Centro",
    cuisine: "Carnes & Asados",
    address: "Av. Insurgentes Sur 1234",
    city: "Ciudad de México",
    longitude: -99.1769,
    latitude: 19.3906,
    rating: 4.7,
    reviews: 1284,
    priceRange: "$$$",
    status: "abierto",
    hours: "12:00 - 23:00",
    phone: "+52 55 1234 5678",
    monthlyOrders: 2140,
  },
  {
    id: "r2",
    name: "Sushi Hanami",
    cuisine: "Japonesa",
    address: "Calle Ámsterdam 78, Condesa",
    city: "Ciudad de México",
    longitude: -99.1684,
    latitude: 19.4112,
    rating: 4.9,
    reviews: 956,
    priceRange: "$$$$",
    status: "abierto",
    hours: "13:00 - 22:30",
    phone: "+52 55 2345 6789",
    monthlyOrders: 1680,
  },
  {
    id: "r3",
    name: "Tacos El Güero",
    cuisine: "Mexicana",
    address: "Mercado Roma, Local 12",
    city: "Ciudad de México",
    longitude: -99.1601,
    latitude: 19.4185,
    rating: 4.5,
    reviews: 3210,
    priceRange: "$",
    status: "abierto",
    hours: "08:00 - 20:00",
    phone: "+52 55 3456 7890",
    monthlyOrders: 4520,
  },
  {
    id: "r4",
    name: "Trattoria Bella Napoli",
    cuisine: "Italiana",
    address: "Av. Presidente Masaryk 360",
    city: "Ciudad de México",
    longitude: -99.1942,
    latitude: 19.4326,
    rating: 4.6,
    reviews: 742,
    priceRange: "$$$",
    status: "cerrado",
    hours: "14:00 - 23:30",
    phone: "+52 55 4567 8901",
    monthlyOrders: 1290,
  },
  {
    id: "r5",
    name: "Green Bowl",
    cuisine: "Saludable / Vegana",
    address: "Calle Orizaba 45, Roma Norte",
    city: "Ciudad de México",
    longitude: -99.1598,
    latitude: 19.4205,
    rating: 4.4,
    reviews: 528,
    priceRange: "$$",
    status: "abierto",
    hours: "09:00 - 21:00",
    phone: "+52 55 5678 9012",
    monthlyOrders: 980,
  },
  {
    id: "r6",
    name: "Mariscos La Costa",
    cuisine: "Mariscos",
    address: "Av. Cuauhtémoc 512",
    city: "Ciudad de México",
    longitude: -99.1556,
    latitude: 19.3995,
    rating: 4.3,
    reviews: 1102,
    priceRange: "$$",
    status: "proximamente",
    hours: "11:00 - 19:00",
    phone: "+52 55 6789 0123",
    monthlyOrders: 0,
  },
  {
    id: "r7",
    name: "Café de la Plaza",
    cuisine: "Cafetería & Brunch",
    address: "Plaza Río de Janeiro 50",
    city: "Ciudad de México",
    longitude: -99.1622,
    latitude: 19.4238,
    rating: 4.8,
    reviews: 2045,
    priceRange: "$$",
    status: "abierto",
    hours: "07:00 - 20:00",
    phone: "+52 55 7890 1234",
    monthlyOrders: 3110,
  },
  {
    id: "r8",
    name: "Burger Forge",
    cuisine: "Hamburguesas",
    address: "Av. Álvaro Obregón 200",
    city: "Ciudad de México",
    longitude: -99.1648,
    latitude: 19.4159,
    rating: 4.2,
    reviews: 1876,
    priceRange: "$$",
    status: "abierto",
    hours: "12:00 - 00:00",
    phone: "+52 55 8901 2345",
    monthlyOrders: 2680,
  },
]

export const statusConfig: Record<
  RestaurantStatus,
  { label: string; dot: string; badge: string }
> = {
  abierto: {
    label: "Abierto",
    dot: "bg-chart-2",
    badge: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  },
  cerrado: {
    label: "Cerrado",
    dot: "bg-destructive",
    badge: "bg-destructive/15 text-destructive border-destructive/30",
  },
  proximamente: {
    label: "Próximamente",
    dot: "bg-primary",
    badge: "bg-primary/15 text-primary border-primary/30",
  },
}


export type AdminRestaurantData = {
  id?: string
  code: string
  nombre: string
  nit: string
  pais: string
  ciudad: string
  direccion: string
  description?: string
  latitude: number
  longitude: number
  createdBy: string
  createdAt: string
}

export const DEMO_RESTAURANTS: Record<string, AdminRestaurantData> = {
  'MESA-4821': {
    code: 'MESA-4821',
    nombre: 'La Cocina de Andrés',
    nit: '901.245.678-3',
    pais: 'Colombia',
    ciudad: 'Medellín',
    direccion: 'Cra. 35 #8A-12, El Poblado',
    latitude: 6.209,
    longitude: -75.565,
    createdBy: 'admin@mesa.app',
    createdAt: '02 Jul 2026',
  },
  'MESA-7390': {
    code: 'MESA-7390',
    nombre: 'Brasa & Leña',
    nit: '900.876.112-9',
    pais: 'Colombia',
    ciudad: 'Bogotá',
    direccion: 'Calle 93 #11-27, Chicó',
    latitude: 4.676,
    longitude: -74.047,
    createdBy: 'admin@mesa.app',
    createdAt: '28 Jun 2026',
  },
  'PRC-064C69': {
    code: 'PRC-064C69',
    nombre: 'Restaurante Demo',
    nit: '900.123.456-7',
    pais: 'Colombia',
    ciudad: 'Medellín',
    direccion: 'Calle 10 #20-30',
    latitude: 6.234,
    longitude: -75.567,
    createdBy: 'admin@parce.app',
    createdAt: '06 Jul 2026',
  },
}

