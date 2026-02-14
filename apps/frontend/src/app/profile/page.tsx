'use client';

import { useState, useEffect } from 'react';
import SideBar from '@/components/SideBar';
import { usePathname } from 'next/navigation';
import CatchUpTheMonth from '@/components/outcomes/catchUpTheMonth';
import MobileMenuButton from '@/components/MobileBurgerMenu';
import EditProfileModal from '@/components/modals/EditProfileModal';
import { useProfile, ProfileProvider } from '@/context/ProfileContext';

export default function ProfilePageContainer() {
  // Ensure ProfileProvider wraps your Profile page
  return (
    <ProfileProvider>
      <Profile />
    </ProfileProvider>
  );
}

function Profile() {
  const pathName = usePathname();
  const { profile, updateProfile, setProfile } = useProfile();
  const [editOpen, setEditOpen] = useState(false);

  // Demo: If there's no profile yet, set dummy/default profile (normally, you'd set this from auth).
  useEffect(() => {
    if (!profile) {
      setProfile({
        username: 'demo_user',
        email: 'demo@example.com',
        monthlyCircleDate: '2026-05-01',
        password: 'password123',
      });
    }
  }, [profile, setProfile]);

  if (!profile) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-[#1E1552]">Please log in to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col xs:flex-row min-h-screen gap-1">
      <div className="hidden xs:flex flex-col items-center gap-5 flex-shrink-0 xs:w-64">
        <SideBar
          activePath={pathName}
          className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
        />
        {/*recently investment and miscs */}
      </div>
      <section className="w-full flex flex-col flex-start items-center gap-5">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl xs:text-6xl font-bold text-[#1E1552] text-center z-10">
            PROFILE
          </h1>
          <button
            onClick={() => setEditOpen(true)}
            className="mt-4 mb-3 px-6 py-2 rounded bg-[#29388A] text-white hover:bg-blue-800 font-semibold text-base"
          >
            Edit Profile
          </button>
        </div>
        <CatchUpTheMonth
          header="Quick Catch Up For This Month"
          items={[
            {
              name: 'User Name',
              data: profile.username,
            },
            {
              name: 'Email',
              data: profile.email,
            },
            {
              name: 'Monthly Circle Date',
              data: profile.monthlyCircleDate,
            },
            {
              name: 'Password',
              data: '******',
            },
          ]}
        />
        <EditProfileModal
          open={editOpen}
          initialProfile={profile}
          onClose={() => setEditOpen(false)}
          onSubmit={(updated) => {
            updateProfile(updated);
            setEditOpen(false);
          }}
        />
      </section>
      <MobileMenuButton
        menuItems={[
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/incomes', label: 'Incomes' },
          { href: '/outcomes', label: 'Outcomes' },
          { href: '/investments', label: 'Investments' },
          { href: '/profile', label: 'Profile' },
          { href: '/logout', label: 'Logout' },
        ]}
      />
    </main>
  );
}
