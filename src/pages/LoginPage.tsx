import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, Music2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore, isAuthRequired } from '@/lib/auth-store';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, authNotConfigured, checkSession, checked, username: sessionUser } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  if (isAuthRequired() && !checked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-busy>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (!isAuthRequired()) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground mb-4">{t('auth.notRequired')}</p>
        <Button asChild>
          <Link to="/app">{t('auth.goToApp')}</Link>
        </Button>
      </div>
    );
  }

  if (isAuthRequired() && authNotConfigured) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 gap-4">
        <p className="text-muted-foreground text-center max-w-md text-sm">{t('auth.serverNotConfigured')}</p>
        <Button asChild variant="outline">
          <Link to="/app">{t('auth.goToApp')}</Link>
        </Button>
      </div>
    );
  }

  if (isAuthRequired() && sessionUser) {
    const raw = searchParams.get('redirect');
    const target = raw ? decodeURIComponent(raw) : '/app';
    return <Navigate to={target} replace />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      const raw = searchParams.get('redirect');
      const target = raw ? decodeURIComponent(raw) : '/app';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="glass border-b border-border px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground font-semibold">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Music2 className="w-4 h-4 text-primary-foreground" />
          </div>
          {t('layout.appName')}
        </Link>
        <LanguageSwitcher compact />
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm surface-2 border border-border rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-semibold text-foreground text-center mb-1">{t('auth.title')}</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">{t('auth.subtitle')}</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-username">{t('auth.username')}</Label>
              <Input
                id="login-username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">{t('auth.password')}</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            <Link to="/" className="underline underline-offset-2 hover:text-foreground">
              {t('auth.backHome')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
