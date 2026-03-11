'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type Profile = {
  username: string;
  email: string;
  monthlyCircleDate: string;
  password?: string;
};

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setProfile: (p: any) => void;
  updateProfile: (p: Partial<Profile>) => Promise<boolean>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

function normalizeProfile(raw: any): Profile {
  return {
    username: raw?.username ?? '',
    email: raw?.email ?? '',
    monthlyCircleDate: raw?.monthlyCircleDate ?? raw?.monthly_circle_date ?? '',
    password: '',
  };
}

function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { authorization: `Bearer ${token}` } : {};
}

function toUpdatePayload(partial: Partial<Profile>) {
  return {
    ...(partial.username !== undefined ? { username: partial.username } : {}),
    ...(partial.email !== undefined ? { email: partial.email } : {}),
    ...(partial.monthlyCircleDate !== undefined
      ? { monthly_circle_date: partial.monthlyCircleDate }
      : {}),
    ...(partial.password && partial.password.trim() ? { password: partial.password } : {}),
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setProfile = (p: any) => {
    if (!p) {
      setProfileState(null);
      return;
    }
    setProfileState(normalizeProfile(p));
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('profile');
      if (stored) {
        setProfileState(normalizeProfile(JSON.parse(stored)));
      }
    } catch {
      setProfileState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  async function updateProfile(partial: Partial<Profile>): Promise<boolean> {
    if (!profile) return false;

    setSaving(true);
    setError(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const mergedLocal = normalizeProfile({ ...profile, ...partial });

    // If no token, keep local update behavior so UI still works.
    if (!token) {
      setProfileState(mergedLocal);
      setSaving(false);
      return true;
    }

    try {
      const payload = toUpdatePayload(partial);
      const res = await fetch(`${getApiBase()}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to update profile (${res.status})`);
      }

      const updated = await res.json();
      setProfileState(normalizeProfile(updated));
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile');
      // keep local change so user does not lose edits in UI
      setProfileState(mergedLocal);
      return false;
    } finally {
      setSaving(false);
    }
  }
  const value = useMemo(
    () => ({ profile, loading, saving, error, setProfile, updateProfile }),
    [profile, loading, saving, error],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
