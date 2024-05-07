'use client'


import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from '@/app/loading';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: session, status }  = useSession();

  if(status === 'loading'){
    return <Loading />
  }

  const user = session?.user;
  var name = user?.user?.name.split(" ");
  var letter = user?.user?.name.charAt(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

 
  return (
    <div className="relative grid place-content-center md:hidden">
      <button
        type="button"
        className="text-white focus:outline-none focus:white transition duration-300 ease-linear"
        onClick={toggleMenu}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 right-0 top-[20px] mt-2 py-2 w-48 hover:text-white text-gray-400 bg-black rounded-md shadow-lg transition duration-300">
          
          {status !== "loading" && user && (
            <>
              <Link href={`/profile/${user?.user?.slug}`} className="cursor-pointer block px-4 py-2 text-sm hover:text-white text-gray-400">Profile</Link>
              <Link href='/create-post' className="cursor-pointer block px-4 py-2 text-sm hover:text-white text-gray-400">Create a Post</Link>
              </>
            )}
            {!user && (
              <p onClick={()=>signIn()} className="cursor-pointer block px-4 py-2 text-sm hover:text-white text-gray-400">Sign In</p>
            )}
          <Link
            href="/"
            className="block px-4 py-2 text-sm hover:text-white text-gray-400 transition duration-300"
          >
            Home
          </Link>
          <p
            className="flex cursor-pointer items-center gap-1 px-4 py-2 text-sm hover:text-white text-gray-400 transition duration-300"
            onClick={toggleDropdown}
          >
            Categories <ChevronDownIcon className={`h-4 w-4 ${showDropdown ? 'rotate-180 transition duration-300 ease-in-out' : 'transition duration-300 ease-in-out'}`} />
          </p>
          {showDropdown && (
            <div className="pl-4">
              <Link href="/category/travel" className="block px-2 py-1 text-sm hover:text-white text-gray-400">
                Travel
              </Link>
              <Link href="/category/food" className="block px-2 py-1 text-sm hover:text-white text-gray-400">
                Food
              </Link>
              <Link href="/category/technology" className="block px-2 py-1 text-sm hover:text-white text-gray-400">
                Technology
              </Link>
              <Link href="/category/fashion" className="block px-2 py-1 text-sm hover:text-white text-gray-400">
                Fashion
              </Link>
            </div>
          )}
          <Link
            href="/about"
            className="block px-4 py-2 text-sm hover:text-white text-gray-400 transition duration-300"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-sm hover:text-white text-gray-400 transition duration-300"
          >
            Contact
          </Link>
            {status != 'loading' && user && (
              <p onClick={()=>signOut()} className="cursor-pointer block px-4 py-2 text-sm hover:text-white text-gray-400">Logout</p>
            )}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
