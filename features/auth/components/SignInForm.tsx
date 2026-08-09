"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignInInput } from "../validations/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { useRedirectAfterAuth } from "../hooks/useRedirectAfterAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { sileo } from "sileo";
import { useRouter } from "next/navigation";

export function SignInForm() {
    const { login, isLoading } = useAuth();
    useRedirectAfterAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInInput>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignInInput) => {
        const result = await login(data);
        if (result.success) {
            sileo.success({ title: "Login exitoso", position: "top-center" });
            // Redirección directa según el rol usando window.location para forzar recarga
            const targetUrl = result.role === 'ADMIN' ? '/dashboard/superadmin' : '/dashboard/owner';
            window.location.href = targetUrl;
        } else {
            const errorMessage = result.error instanceof Error ? result.error.message : String(result.error);
            sileo.error({ title: "Error al iniciar sesión", description: errorMessage, position: "top-center" });
        }
    };

    return (
         <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">¿No tienes cuenta? </span>
            <a href="/sign-up" className="text-blue-600 hover:underline font-medium">
              Regístrate aquí
            </a>
          </div>
          <div className="text-center text-sm">
    <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
        ¿Olvidaste tu contraseña?
    </a>
</div>
        </CardFooter>
      </form>
    </Card>
    )
}


