'use client';

import { useState, useEffect, startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import Slideshow from '@/app/components/imageSlider';
import { FormSuccess } from '@/app/components/FormSuccess';
import { FormError } from '@/app/components/FormError';
import { FormWarning } from '@/app/components/FormWarning'
import { signIn, useSession } from 'next-auth/react';
import { loginAction } from '@/app/action/login';
import { DEFAULT_LOGIN_REDIRECT } from '../../../../routes';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState("");
  const [showError, setShowError] = useState("");
  const [showWarning, setShowWarning] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const loginUser = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    const checkUser = await loginAction(email)
    console.log(checkUser);


    if (!checkUser.error) {
      try {
        const signInResult = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        });
        console.log("INI SIGN IN RESULT:", signInResult);
        

        if (signInResult?.error) {
          setShowError("Failed to login: " + signInResult.error);
          setShowSuccess("");
          setShowWarning("Sign up or verify your email!")
        } else {
          setShowSuccess("Login successfully");
          setShowError("");
          router.push(DEFAULT_LOGIN_REDIRECT);
        }
      } catch (error) {
        setShowError("Failed to login");
        setShowSuccess("");
      }
    } else {
      setShowError(checkUser.message);
    }
  };

  useEffect(() => {
    if (session) {
      if (session?.admin?.type === "admin") {
        router.refresh();
        router.push('/admin');
      } else {
        router.refresh();
        router.push('/home');
      }
    }
  }, [session, router]);

  return (
    <main className="flex flex-col min-h-screen p-6 bg-gray-100 md:justify-center md:p-24">
      <title>Login</title>
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <section className="md:w-1/2 p-4 flex justify-center">
          <div className="container mx-auto">
            <Slideshow />
          </div>
        </section>
        <section className="md:w-1/2 p-6 border-2 border-solid bg-white rounded-lg mx-auto flex justify-center items-center shadow-lg">
          <div className="container max-w-md w-full">
            <h1 className="text-3xl text-blue-500 text-center mb-4">Masuk</h1>
            <h2 className="text-lg text-gray-700 mb-8 text-center">Isi Kolom Dibawah ini</h2>
            <form className="flex flex-col space-y-4" onSubmit={loginUser}>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormSuccess message={showSuccess} />
              <FormError message={showError} />
              <FormWarning message={showWarning} />
              <button type="submit" className="w-full bg-green-500 text-white p-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300">Masuk</button>
              <div className="text-center">
                <span className="text-lg">Belum Punya Akun? </span>
                <button type="button" onClick={() => router.push('/register')} className="text-lg text-blue-500 hover:underline">Register</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}