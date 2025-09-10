import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/api';

type Perms = Record<string, Record<string, boolean>>;

type State = {
  user: { email: string } | null;
  token: string | null;
  permissions: Perms;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function permsFromRoles(roles: { name: string }[] = []): Perms {
  const names = roles.map(r => r.name);
  const perms: Perms = {};
  if (names.includes('admin')) {
    perms['Tour'] = { create: true, read: true, update: true, delete: true, manage: true } as any;
    perms['User'] = { manage: true } as any;
  } else if (names.includes('editor')) {
    perms['Tour'] = { create: true, read: true, update: true, delete: false };
  }
  return perms;
}

export const useAuthStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      permissions: {},
      async login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        const token = data.access_token as string;
        const payload = decodeJwt(token);
        const roles = payload?.roles ?? [];
        const permissions = permsFromRoles(roles);
        set({ user: { email }, token, permissions });
      },
      logout() {
        set({ user: null, token: null, permissions: {} });
      },
    }),
    { name: 'auth' }
  )
);
