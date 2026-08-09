"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordInput } from "../validations/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { sileo } from "sileo";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
    const { resetPassword, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            token: token,
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        const result = await resetPassword(data);
        if (result.success) {
            sileo.success({ title: "Contraseña actualizada", description: "Ya puedes iniciar sesión con tu nueva contraseña", position: "top-center" });
            setTimeout(() => {
                window.location.href = '/sign-in';
            }, 2000);
        } else {
            sileo.error({ title: "Error", description: result.error as string, position: "top-center" });
        }
    };

    if (!token) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Token inválido</CardTitle>
                    <CardDescription>
                        El enlace de recuperación es inválido o ha expirado
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = '/forgot-password'}
                    >
                        Solicitar nuevo enlace
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Cambiar Contraseña</CardTitle>
                <CardDescription className="text-center">
                    Ingresa tu nueva contraseña
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nueva Contraseña</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                {...register('confirmPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </Button>

                    <div className="text-center text-sm">
                        <a href="/sign-in" className="text-blue-600 hover:underline font-medium">
                            Volver a iniciar sesión
                        </a>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}