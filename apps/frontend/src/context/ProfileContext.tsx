'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Profile = {
  username: string;
  email: string;
  monthlyCircleDate: string;
  password: string;
};

type ProfileContextType = {
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  updateProfile: (p: Partial<Profile>) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  function updateProfile(partial: Partial<Profile>) {
    setProfile((prev) => (prev ? { ...prev, ...partial } : prev));
  }
  useEffect(() => {
    const stored = localStorage.getItem('profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Map to context shape
        setProfile({
          username: parsed.username ?? '',
          email: parsed.email ?? '',
          monthlyCircleDate: parsed.monthly_circle_date ?? '',
          password: '', // never store real password in frontend!
        });
      } catch (err) {
        setProfile(null);
      }
    }
  }, []);
  return (
    <ProfileContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

// The correct hook name is useProfile!
export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
