import { z } from "zod";

export const SignUpSchema = z.object({
    firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
    lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),
    email: z.string()
    .email('Email inválido')
    .min(1, 'El email es requerido')
    .toLowerCase(),
    password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe tener al menos un carácter especial'),
     confirmPassword: z.string()
    .min(1, 'Debes confirmar tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const SignInSchema = z.object({
    email: z.string()
    .email('Email inválido')
    .min(1, 'El email es requerido')
    .toLowerCase(),
    password: z.string()
    .min(1, 'La contraseña es requerida'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'El email es requerido').toLowerCase(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'El token es requerido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe tener al menos una minúscula')
    .regex(/[0-9]/, 'Debe tener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe tener al menos un carácter especial'),
  confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const createRestaurantShema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  nit_rut: z.string().min(5, "El NIT/RUT válido es obligatorio"),
  address: z.string().min(5, "La dirección detallada es obligatoria"),
  latitude: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= -90 && num <= 90;
  }, "La latitud debe ser un número entre -90 y 90"),
  longitude: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= -180 && num <= 180;
  }, "La longitud debe ser un número entre -180 y 180"),
})

export type SignUpInput = z.infer<typeof SignUpSchema>
export type SignInInput = z.infer<typeof SignInSchema>
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
export type CreateRestaurantInput = z.infer<typeof createRestaurantShema>
