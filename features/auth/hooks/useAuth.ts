import { useAuthStore } from "../store/auth.store";
import { SignInInput, SignUpInput, ForgotPasswordInput, ResetPasswordInput } from "../validations/auth.schema";

export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
    } = useAuthStore();

    const handleLogin = async (data: SignInInput) => {
       try {
            await login(data);

            // 🔍 Recuperamos el usuario con el rol que el backend ya entrega bien
            const freshUser = useAuthStore.getState().user;
            const role = freshUser?.role || 'OWNER';

            // 🍪 Seteamos la cookie de rol inmediatamente
            document.cookie = `user_role=${role}; path=/; max-age=86400; SameSite=Lax`;

            return { success: true, role };
        } catch (error) {
            return { success: false, error };
        }
    };
    const handleRegister = async (data: SignUpInput) => {
        clearError();
        try {
            const { confirmPassword, ...registerData } = data;
            await register({ ...registerData, role: "OWNER" });
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    const handleForgotPassword = async (data: ForgotPasswordInput) => {
        clearError();
        try {
            await forgotPassword(data.email);
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    const handleResetPassword = async (data: ResetPasswordInput) => {
        clearError();
        try {
            const { confirmPassword, ...resetData } = data;
            await resetPassword(resetData.token, resetData.password);
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    const handleVerifyEmail = async (token: string, email: string) => {
        clearError();
        try {
            await verifyEmail(token, email);
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    const handleResendVerification = async (email: string) => {
        clearError();
        try {
            await resendVerification(email);
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout,
        clearError,
        forgotPassword: handleForgotPassword,
        resetPassword: handleResetPassword,
        verifyEmail: handleVerifyEmail,
        resendVerification: handleResendVerification,
    };
};