'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation"
import { signOut, useSession } from 'next-auth/react';
import { CardMedia } from '@mui/material';
import Popup from './Popup';
import { FaUser, FaCartArrowDown } from "react-icons/fa";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { data: session, status } = useSession();
  const [popupMessage, setPopupMessage] = useState('');

  const handleProfileClick = () => {
    if (!session) {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSignOut = async () => {
    setPopupMessage('You have successfully signed out.');
    setShowPopup(true);
    await signOut({ redirect: false });
    router.push("/home");
  }

  return (
    <nav className="sticky top-0 left-0 w-full z-10 bg-[#0B3B49] border-gray-200 px-2 sm:px-4 py-2.5 flex">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <div className="flex items-center">
          <button className="text-[#FFECD1] hover:text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          {
            !session?.admin ?
              <Link href="/">
                <span className="self-center text-xl font-semibold whitespace-nowrap text-[#FFECD1] hidden md:flex">ARTEM</span>
              </Link>
              :
              <Link href="/admin">
                <span className="self-center text-xl font-semibold whitespace-nowrap text-[#FFECD1] hidden md:flex">Dashboard</span>
              </Link>
          }
        </div>
        <div className={`${isOpen ? 'flex' : 'hidden'} flex-col md:flex md:flex-row md:space-x-8 md:justify-between md:items-center w-full md:w-auto md:order-1`}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
            {
              !session?.admin ?
                <li>
                  <Link href="/home">
                    <span className="text-[#FFECD1] hover:text-white">Home</span>
                  </Link>
                </li>
                :
                null
            }
            {
              !session?.admin ?
                <li>
                  <Link href="/product">
                    <span className="text-[#FFECD1] hover:text-white">Product</span>
                  </Link>
                </li>
                :
                null
            }
            {
              !session?.admin ?
                <li>
                  <Link href="/request">
                    <span className="text-[#FFECD1] hover:text-white">Request</span>
                  </Link>
                </li>
                :
                null
            }
            {
              !session?.admin ?
                <li>
                  <Link href="/about">
                    <span className="text-[#FFECD1] hover:text-white">About</span>
                  </Link>
                </li>
                :
                null
            }
            {
              !session?.admin ?
                <li>
                  <Link href="/history">
                    <span className="text-[#FFECD1] hover:text-white">History</span>
                  </Link>
                </li>
                :
                null
            }
          </ul>
        </div>
        <div className="flex md:order-2">
          {status === 'loading' ? (
            <p className="text-[#FFECD1]">Loading...</p>
          ) : session ? (
            <>
              <div className="flex items-center space-x-4"> {/* Added space-x-4 class */}
                <Link href="/profile">
                  <button className="text-[#FFECD1] hover:text-white rounded-lg text-sm p-2.5 h-8 w-8 image-red">
                    <div><FaUser /></div>
                  </button>
                </Link>
                {
                  !session?.admin ?
                    <button className="text-[#FFECD1] hover:text-white rounded-lg text-sm p-2.5 h-8 w-8">
                      <Link href="/cart">
                        <div><FaCartArrowDown /></div>
                      </Link>
                    </button>
                    :
                    null
                }
              </div>

            </>
          ) : (
            <>
              <button
                className="text-[#FFECD1] hover:text-white rounded-lg text-sm p-2.5 ml-1 h-8 w-8 image-red"
                onClick={handleProfileClick}
              >
                <div><FaUser /></div>
              </button>
              <button className="text-[#FFECD1] hover:text-white rounded-lg text-sm p-2.5 ml-1 h-8 w-8">
                <Link href="/cart">
                  <div><FaCartArrowDown /></div>
                </Link>
              </button>
            </>
          )}
        </div>
      </div>
      {
        !session && showPopup && (
          <Link href="/login">
            <Popup
              message="You need to be logged in to access your profile."
              onClose={handleClosePopup}
              buttonText='Go To Login'
            >
            </Popup>
          </Link>
        )
      }
    </nav >
  );
};

export default Navbar;