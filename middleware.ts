// middleware.ts (Adaptado para control de roles)
import { NextResponse, type NextRequest } from 'next/server';

const CONFIG = {
  PUBLIC_ROUTES: [
    '/', '/sign-in', '/sign-up', '/forgot-password',
    '/reset-password', '/pricing', '/about', '/contact'
  ],
  AUTH_ROUTES: ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'],
  
  // 🔒 Dividimos las rutas protegidas por rol
  ADMIN_ROUTES: ['/dashboard/superadmin', '/admin'],
  OWNER_ROUTES: ['/dashboard/owner', '/products', '/settings'],
  
  STATIC_ASSETS: ['/_next/', '/favicon.ico', '/images/', '/fonts/', '/api/', '/trpc/'],
} as const;

function isStaticAsset(pathname: string): boolean {
  return CONFIG.STATIC_ASSETS.some(asset => pathname.startsWith(asset));
}

function isAuthRoute(pathname: string): boolean {
  return CONFIG.AUTH_ROUTES.some(route => pathname === route);
}

// Helpers para comprobar permisos de rutas
function isAdminRoute(pathname: string): boolean {
  return CONFIG.ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

function isOwnerRoute(pathname: string): boolean {
  return CONFIG.OWNER_ROUTES.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // 1. Obtener Token y Rol desde las cookies
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const isAuthenticated = !!token;

  // 2. Si ya está autenticado e intenta ir a login/registro, redirigir a su panel correcto
  if (isAuthenticated && isAuthRoute(pathname)) {
    const defaultUrl = role === 'ADMIN' ? '/dashboard/superadmin' : '/dashboard/owner';
    return NextResponse.redirect(new URL(defaultUrl, request.url));
  }

  // 3. Control estricto para Admin
  if (isAdminRoute(pathname)) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/sign-in', request.url));
    if (role !== 'ADMIN') {
      // Si es un dueño intentando entrar a admin, lo rebotamos a su propio panel
      return NextResponse.redirect(new URL('/dashboard/owner', request.url));
    }
  }

  // 4. Control estricto para Dueño de Restaurante (Owner)
  if (isOwnerRoute(pathname)) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/sign-in', request.url));
    if (role === 'ADMIN') {
      // Si el admin intenta entrar aquí, lo mandamos a su panel
      return NextResponse.redirect(new URL('/dashboard/superadmin', request.url));
    }
  }

  // 5. Redirecciones automáticas para las rutas raíz ('/') o el '/dashboard' genérico
  if (pathname === '/' || pathname === '/dashboard') {
    if (isAuthenticated) {
      const targetUrl = role === 'ADMIN' ? '/dashboard/superadmin' : '/dashboard/owner';
      return NextResponse.redirect(new URL(targetUrl, request.url));
    } else {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};