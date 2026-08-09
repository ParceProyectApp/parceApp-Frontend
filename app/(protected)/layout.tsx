// app/(protected)/layout.tsx
import { AuthRedirect } from '@/components/auth/AuthRedirect';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRedirect>
      <div className="max-w-full bg-white dark:bg-[#26292f]">
        <main>{children}</main>
      </div>
    </AuthRedirect>
  );
}