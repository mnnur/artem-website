'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Popup from '@/app/components/Popup';

const ProfilePage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession()
  const userId = session?.user.id
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    if (userId) {
      const getUserById = async () => {
        try {
          const profileResponse = await fetch(`/api/user/${userId}`, {
            method: "GET",
          });

          const contentType = profileResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await profileResponse.json();
            if (data.error) {
              throw new Error(data.message);
            }
            setUser(data.data);
            setName(data.data.name);
            setEmail(data.data.email);
            setAddress(data.data.address);
            setPhoneNumber(data.data.phoneNumber);
          } else {
            const text = await profileResponse.text();
            console.error("Unexpected response format:", text);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: "Error",
            description: "Internal server error",
            variant: 'destructive',
          });
        }
      };
      getUserById();
    }
  }, [userId]);

  const handleSaveProfile = async (e: any) => {
    e.preventDefault()

    const response = await fetch(
      `http://localhost:3000/api/user/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          address,
          phoneNumber
        }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);

      if (responseData.code === 200) {
        router.refresh()
        setPopupMessage('Data Profile have been saved.');
        setShowPopup(true);
      } else {
        toast({
          title: 'Error',
          description: responseData.message,
          variant: 'destructive',
        });
      }
    } else {
      console.error('Failed to update profile');
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSignOut = async () => {
    setPopupMessage('You have successfully signed out.');
    setShowPopup(true);
    await signOut({ redirect: false });
    router.push("/home");
  }

  const verifyEmail = async () => {
    const response = await fetch(
      'http://localhost:3000/api/user/verification',
      {
        method: 'POST',
      }
    );

    if (response.ok) {
      const responseData = await response.json()
      if (responseData.code === 200) {
        setPopupMessage('Verification has been sent, please check your email.');
        setShowPopup(true);
      } else if (responseData.code === 500) {
        toast({
          title: "Error",
          description: "Error error",
          variant: 'destructive'
        })
      } else if (responseData.code === 401) {
        toast({
          title: "401 no authorization",
          description: "Please login",
          variant: 'destructive'
        })
      } else if (responseData.code === 400) {
        toast({
          title: "400 bad request",
          description: "Already verified",
          variant: 'destructive'
        })
      }
    } else {
      console.error('Verification Failed')
    }
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <title>Profile</title>
      <header className="bg-[#0B3B49] py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#FFECD1]">Profile</h1>
          <p className="text-lg mt-2 text-[#FFECD1]">
            <Link href="/">
              <span className="hover:text-blue-500 cursor-pointer">Home</span>
            </Link>
            <span className="mx-5 text-[#FFECD1]">&gt;</span>
            <Link href="/profile">
              <span className="hover:text-blue-500 cursor-pointer">Profile</span>
            </Link>
          </p>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSaveProfile}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nama
            </label>
            {
              !session?.admin ?
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Name"
                  defaultValue={user?.name || ""}
                  onChange={(e) => setName(e.target.value)}
                />
                :
                <input
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Name"
                  defaultValue={"Raeljarr"}
                  onChange={(e) => setName(e.target.value)}
                />
            }
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            {
              !session?.admin ?
                <input
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={user?.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                :
                <input
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={"admin@gmail.com"}
                  onChange={(e) => setEmail(e.target.value)}
                />
            }
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Alamat
            </label>
            {
              !session?.admin ?
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  placeholder="Address"
                  defaultValue={user?.address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                :
                <input
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  placeholder="Address"
                  defaultValue={"Jl. Neptunus Alisa"}
                  onChange={(e) => setAddress(e.target.value)}
                />
            }
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              No HP
            </label>
            {
              !session?.admin ?
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  type="text"
                  placeholder="Phone number"
                  defaultValue={user?.phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                :
                <input
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phone"
                  type="text"
                  placeholder="08121409029"
                  defaultValue={"08121409029"}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
            }
          </div>
          <div className="flex items-center justify-center gap-3">
            {!session?.admin ?
              <button
                className="bg-[#0B3B49] hover:bg-[#0A2E3A] text-white font-bold py-2 px-4 mr-6 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Simpan
              </button>
              :
              null}
            {
              !session?.admin ?
                <button
                  className="bg-[#0B3B49] hover:bg-[#0A2E3A] text-white font-bold py-2 px-4 mr-6 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={verifyEmail}
                >
                  Verifikasi
                </button>
                :
                null
            }
            <button
              className="bg-[#e45a5a] hover:bg-[#be3545] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </form>
        {showPopup && (
          <Popup
            message={popupMessage}
            onClose={handleClosePopup}
            buttonText='Confirm'
          />
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
