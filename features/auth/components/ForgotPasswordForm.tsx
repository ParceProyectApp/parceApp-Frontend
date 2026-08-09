"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, ForgotPasswordInput } from "../validations/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { sileo } from "sileo";
import { useState } from "react";

export function ForgotPasswordForm() {
    const { forgotPassword, isLoading } = useAuth();
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        const result = await forgotPassword(data);
        if (result.success) {
            setEmailSent(true);
            sileo.success({ title: "Email enviado", description: "Revisa tu correo para resetear tu contraseña", position: "top-center" });
        } else {
            const errorMessage = result.error instanceof Error ? result.error.message : String(result.error);
            sileo.error({ title: "Error", description: errorMessage, position: "top-center" });
        }
    };

    if (emailSent) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">Email Enviado</CardTitle>
                    <CardDescription>
                        Hemos enviado un email a tu correo con instrucciones para resetear tu contraseña
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setEmailSent(false)}
                    >
                        Enviar otro email
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">¿Olvidaste tu contraseña?</CardTitle>
                <CardDescription className="text-center">
                    Ingresa tu email para recibir instrucciones de recuperación
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
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
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