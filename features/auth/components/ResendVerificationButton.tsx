"use client";

import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";

interface ResendVerificationButtonProps {
    email: string;
}

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
    const { resendVerification, isLoading } = useAuth();

    const handleResend = async () => {
        const result = await resendVerification(email);
        if (result.success) {
            sileo.success({ title: "Email reenviado", description: "Revisa tu correo para verificar tu cuenta", position: "top-center" });
        } else {
            sileo.error({ title: "Error", description: result.error as string, position: "top-center" });
        }
    };

    return (
        <Button 
            variant="link" 
            className="text-sm"
            onClick={handleResend}
            disabled={isLoading}
        >
            {isLoading ? 'Enviando...' : 'Reenviar email de verificación'}
        </Button>
    );
}