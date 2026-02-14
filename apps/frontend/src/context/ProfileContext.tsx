'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
