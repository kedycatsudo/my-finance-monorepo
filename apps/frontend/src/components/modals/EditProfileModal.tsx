'use client';

import { useState, useEffect } from 'react';
import FieldInput from '../forms/FieldInput';
import { Profile } from '@/context/ProfileContext';

type EditProfileModalProps = {
  open: boolean;
  initialProfile: Profile;
  onClose: () => void;
  onSubmit: (updated: Partial<Profile>) => void;
};

export default function EditProfileModal({
  open,
  initialProfile,
  onClose,
  onSubmit,
}: EditProfileModalProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [formErrors, setFormErrors] = useState<{ [key in keyof Profile]?: string }>({});

  useEffect(() => {
    setProfile(initialProfile);
    setFormErrors({});
  }, [initialProfile, open]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  function handleInput(field: keyof Profile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const errors: typeof formErrors = {};
    if (!profile.username) errors.username = 'Username is required';
    if (!profile.email) errors.email = 'Email is required';
    if (!profile.monthlyCircleDate) errors.monthlyCircleDate = 'Date is required';
    if (!profile.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (validate()) {
      onSubmit(profile);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40 p-1">
      <div className="w-full max-w-lg bg-[#989899] rounded-lg shadow-2xl p-4 relative max-h-[90vh] flex flex-col sm:max-w-full sm:rounded-none sm:h-full sm:justify-end sm:p-2">
        <div className="overflow-y-auto flex-1 gap-3 flex flex-col">
          <h2 className="text-2xl font-bold mb-2 text-[#29388A] text-center">Edit Profile</h2>
          <div className="flex flex-col gap-2">
            <FieldInput
              label="Username"
              type="text"
              value={profile.username}
              onChange={(v) => handleInput('username', v)}
              err={formErrors.username}
            />
            <FieldInput
              label="Email"
              type="email"
              value={profile.email}
              onChange={(v) => handleInput('email', v)}
              err={formErrors.email}
            />
            <FieldInput
              label="Monthly Circle Date"
              type="date"
              value={profile.monthlyCircleDate}
              onChange={(v) => handleInput('monthlyCircleDate', v)}
              err={formErrors.monthlyCircleDate}
            />
            <FieldInput
              label="Password"
              type="password"
              value={profile.password}
              onChange={(v) => handleInput('password', v)}
              err={formErrors.password}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-[#29388A] text-white hover:bg-blue-800 font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
