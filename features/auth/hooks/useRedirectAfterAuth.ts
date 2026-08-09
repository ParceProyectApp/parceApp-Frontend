"use client"

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";

export function useRedirectAfterAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth(); // Obtenemos el usuario

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = document.cookie
        .split('; ')
        .find(row => row.startsWith('redirectTo='))
        ?.split('=')[1];

      if (redirectTo) {
        document.cookie = 'redirectTo=; max-age=0; path=/';
        router.push(redirectTo);
        return;
      }

      // 🚀 Evaluamos el rol real para evitar bucles infinitos
      const currentRole = user?.role || document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1];

      const targetUrl = currentRole === 'ADMIN' ? '/dashboard/superadmin' : '/dashboard/owner';

      // Si ya estamos en la ruta correcta, no hacemos nada
      if (pathname === targetUrl) {
        return;
      }

      // Si estamos en una ruta incorrecta, redirigimos
      if (currentRole === 'ADMIN' && !pathname.startsWith('/dashboard/superadmin')) {
        router.push('/dashboard/superadmin');
      } else if (currentRole !== 'ADMIN' && !pathname.startsWith('/dashboard/owner')) {
        router.push('/dashboard/owner');
      }
    }
  }, [isAuthenticated, router, user, pathname]);
}