'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assetPrefix } from '@/constants/config';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showModal } = useModal();
  const router = useRouter();

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [monthlyCircleDate, setMonthlyCircleDate] = useState('');

  // Per-field errors state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate fields
    const errors: { [key: string]: string } = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    if (!email) errors.email = 'Email is required';
    if (!monthlyCircleDate) errors.monthlyCircleDate = 'Monthly circle date is required';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    // Await async register
    const res = await register({ username, email, monthly_circle_date: monthlyCircleDate, password });
    setLoading(false);

    // Handle per-field errors if provided
    if (!res.success) {
      if (res.message?.includes('Username')) {
        setFormErrors({ username: res.message });
      } else if (res.message?.includes('email')) {
        setFormErrors({ email: res.message });
      } else {
        setFormErrors({ general: res.message });
      }
      showModal(res.message);
      return;
    }

    // Success: clear form, feedback, redirect
    setUsername('');
    setPassword('');
    setEmail('');
    setMonthlyCircleDate('');
    setFormErrors({});
    showModal(res.message);
    router.push('/login');
  }

  return (
    <main className="flex flex-col items-center justify-center relative px-2 sm:px-4">
      <Image
        src={`${assetPrefix}images/myFinanceLogo.png`}
        alt="MyFinance Logo"
        width={250}
        height={250}
        className="shadow-lg rounded-full object-cover z-[9999] mt-2"
      />
      <h1 className="text-3xl xs:text-6xl font-bold text-[#1E1552] mb-8 w-full text-center z-10">
        Register
      </h1>
      <div className="bg-[#3A4483] opacity-75 rounded-2xl flex flex-col justify-center items-center border-4 border-[#29388A] w-full max-w-md sm:max-w-lg md:max-w-xl px-4 py-8">
        <form
          className="w-full flex flex-col gap-1 sm:gap-4 md:gap-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <label htmlFor="username" className="text-white mb-1">
            Username
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 rounded-lg bg-[#3A4483] text-1xl sm:text-2xl md:text-3xl text-white outline-none w-full"
              autoComplete="username"
            />
            {formErrors.username && (
              <span className="text-red-500 text-xs block mt-1">{formErrors.username}</span>
            )}
          </label>
          <hr className="border-t-4 border-[#29388A] my-0 rounded" />

          <label htmlFor="password" className="text-white mb-1">
            Password
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg bg-[#3A4483] text-1xl sm:text-2xl md:text-3xl text-white outline-none w-full"
              autoComplete="new-password"
            />
            {formErrors.password && (
              <span className="text-red-500 text-xs block mt-1">{formErrors.password}</span>
            )}
          </label>
          <hr className="border-t-4 border-[#29388A] my-0 rounded" />

          <label htmlFor="email" className="text-white mb-1">
            Email
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg bg-[#3A4483] text-1xl sm:text-2xl md:text-3xl text-white outline-none w-full"
              autoComplete="email"
            />
            {formErrors.email && (
              <span className="text-red-500 text-xs block mt-1">{formErrors.email}</span>
            )}
          </label>
          <hr className="border-t-4 border-[#29388A] my-0 rounded" />

          <label htmlFor="date" className="text-white mb-1">
            Monthly circle date
            <input
              id="date"
              type="date"
              placeholder="Monthly Circle Date"
              value={monthlyCircleDate}
              onChange={(e) => setMonthlyCircleDate(e.target.value)}
              className="p-3 rounded-lg bg-[#3A4483] text-1xl sm:text-2xl md:text-3xl text-white outline-none w-full"
              autoComplete="off"
            />
            {formErrors.monthlyCircleDate && (
              <span className="text-red-500 text-xs block mt-1">
                {formErrors.monthlyCircleDate}
              </span>
            )}
          </label>
          <hr className="border-t-4 border-[#29388A] my-0 rounded" />

          {formErrors.general && (
            <span className="text-red-500 text-xs block mb-2">{formErrors.general}</span>
          )}
          <button
            type="submit"
            className="mt-4 p-3 rounded-lg bg-[#1E1552] opacity-50 text-white font-bold hover:bg-[#18123d] hover:opacity-100 transition w-full"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Submit'}
          </button>
        </form>
        <p className="text-xs text-white mt-4 opacity-70 text-center">
          Do you have an account already?
          <Link
            href="/login"
            className="font-bold underline cursor-pointer hover:text-blue-200 ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
