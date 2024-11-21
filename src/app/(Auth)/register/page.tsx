'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import Slideshow from "@/app/components/imageSlider";
import { FormSuccess } from '@/app/components/FormSuccess';
import { FormError } from '@/app/components/FormError';

export default function Register() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [showSuccess, setShowSuccess] = useState("");
  const [showError, setShowError] = useState("");
  const router = useRouter();

  const registerUser = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const response = await fetch(
      'http://localhost:3000/api/user',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, email, password, phoneNumber, address
        })
      }
    );

    if (response.ok) {
      const responseData = await response.json()
      if (responseData.code === 200) {
        setShowSuccess(responseData.message)
        setShowError("")
      }
      else {
        console.log(responseData.message)
        setShowError(responseData.message)
        setShowSuccess("")
        return;
      }
    }
    else {
      console.error('Verification Failed')
    }
  }
  return (
    <main className="flex flex-col min-h-screen p-6 bg-gray-100 md:justify-center md:p-24">
      <title>Register</title>
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <section className="md:w-1/2 p-4 flex justify-center">
          <div className="container mx-auto">
            <Slideshow></Slideshow>
          </div>
        </section>
        <section className="md:w-1/2 p-6 border-2 border-solid bg-white rounded-lg mx-auto flex justify-center items-center shadow-lg">
          <div className="container max-w-md w-full">
            <h1 className="text-3xl text-blue-500 text-center mb-4">Buat Akun</h1>
            <h2 className="text-lg text-gray-700 mb-8 text-center">Isi Kolom Dibawah ini</h2>
            <form className="flex flex-col space-y-4" onSubmit={registerUser}>
              <input
                type="text"
                placeholder="Nama"
                className="w-full p-4 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nomor Telepon"
                className="w-full p-4 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Alamat"
                className="w-full p-4 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <FormSuccess message={showSuccess} />
              <FormError message={showError} />
              <button type="submit" className="w-full bg-green-500 text-white p-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300">
                Buat Akun
              </button>

              <div>
                <p className="w-full text-black mt-4 text-center">
                  Sudah Punya Akun?{" "}
                  <a href="/login" className="underline hover:underline">
                    Masuk
                  </a>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}