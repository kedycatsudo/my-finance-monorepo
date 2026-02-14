'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assetPrefix, basePath } from '@/constants/config';
export default function LoginPage() {
  const { login } = useAuth();
  const { showModal } = useModal();
  const router = useRouter();
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // call authContext's login

    const res = login(username, password);
    showModal(res.message); // show feedback as modal (success or error)
    if (res.success) {
      // clear the form
      setUsername('');
      setPassword('');
      router.push('/dashboard');
    }
  }
  return (
    <main className="flex flex-col items-center justify-center relative px-2 sm:px-4">
      <Image
        src={`${assetPrefix}images/myFinanceLogo.png`}
        alt="MyFinance Logo"
        width={250}
        height={250}
        className=" shadow-lg rounded-full object-cover z-[9999] mt-2"
      ></Image>
      <h1 className="text-3xl xs:text-6xl font-bold text-[#1E1552] mb-8 w-full text-center z-10">
        Login
      </h1>
      <div className="bg-[#3A4483] opacity-75 rounded-2xl flex flex-col justify-center items-center border-4 border-[#29388A] w-full max-w-md sm:max-w-lg md:max-w-xl px-4 py-8">
        <form className="w-full flex flex-col gap-1 sm:gap-4 md:gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-lg bg-[#3A4483] text-1xl sm:text-2xl md:text-3xl text-white outline-none w-full"
            required
          />
          <hr className="border-t-4 border-[#29388A] my-0 rounded" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-[#3A4483] text-1xl sm:text-2xl md:text-3xl text-white outline-none w-full"
            required
          />
          <hr className="border-t-4 border-[#29388A] my-0 rounded" />

          <button
            type="submit"
            className="mt-4 p-3 rounded-lg bg-[#1E1552] opacity-50 text-white font-bold hover:bg-[#18123d] hover:opacity-100 transition w-full"
          >
            Submit
          </button>
        </form>
        <p className="text-xs text-white mt-4 opacity-70 text-center">
          You don&apos;t have an account yet?{' '}
          <Link
            href="/register"
            className="font-bold underline cursor-pointer hover:text-blue-200 ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
