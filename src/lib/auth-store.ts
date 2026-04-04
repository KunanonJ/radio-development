import { create } from 'zustand';
import { apiUrl } from '@/lib/api-base';

type AuthState = {
  username: string | null;
  /** True after first `/api/auth/me` check completes. */
  checked: boolean;
  /** Server has no AUTH_JWT_SECRET — APIs are open; UI login is skipped when `VITE_REQUIRE_AUTH` is true. */
  authNotConfigured: boolean;
  checkSession: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

/** When `true`, `/app` requires a successful login (set `AUTH_JWT_SECRET` + D1 user on the server). */
export function isAuthRequired(): boolean {
  return import.meta.env.VITE_REQUIRE_AUTH === 'true';
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  checked: false,
  authNotConfigured: false,

  checkSession: async () => {
    if (!isAuthRequired()) {
      set({ checked: true, username: null, authNotConfigured: false });
      return;
    }

    try {
      const res = await fetch(apiUrl('/api/auth/me'), { credentials: 'same-origin' });
      const data = (await res.json().catch(() => ({}))) as {
        authenticated?: boolean;
        authNotConfigured?: boolean;
        user?: { username?: string };
      };

      if (res.ok && data.authNotConfigured) {
        set({ checked: true, username: null, authNotConfigured: true });
        return;
      }
      if (res.ok && data.authenticated && data.user?.username) {
        set({ checked: true, username: data.user.username, authNotConfigured: false });
        return;
      }
      set({ checked: true, username: null, authNotConfigured: false });
    } catch {
      set({ checked: true, username: null, authNotConfigured: false });
    }
  },

  login: async (username, password) => {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ username, password }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; user?: { username?: string } };
    if (!res.ok) {
      throw new Error(data.error || `Login failed (${res.status})`);
    }
    set({
      username: data.user?.username ?? username,
      authNotConfigured: false,
      checked: true,
    });
  },

  logout: async () => {
    try {
      await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: 'same-origin' });
    } catch {
      /* ignore */
    }
    set({ username: null });
  },
}));
