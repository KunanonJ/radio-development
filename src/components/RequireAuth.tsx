import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore, isAuthRequired } from '@/lib/auth-store';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { username, checked, authNotConfigured, checkSession } = useAuthStore();

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  if (!isAuthRequired()) {
    return <>{children}</>;
  }

  if (authNotConfigured) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background" role="status" aria-busy>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (!username) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
}
