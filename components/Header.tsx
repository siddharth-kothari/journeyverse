"use client";

import React, { useState } from "react";
import HamburgerMenu from "./HamBurgerMenu";
import Link from "next/link";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Loading from "@/app/loading";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [searchKey, setSearchKey] = useState("");

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }
  const user = session?.user;
  var name = user?.user?.name.split(" ");
  var letter = user?.user?.name.charAt(0);

  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSearch = (keyword: string) => {
    // setSearchKey(keyword)
    setTimeout(() => {
      router.push(`/?search=${keyword}`);
    }, 1000);
  };

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center text-white justify-evenly md:block bg-black px-5 md:px-0`}
    >
      <div className="flex w-full items-center justify-between pt-5 pb-1 md:border-b md:border-white/20 md:w-[90%] mx-auto">
        <div>
          <Link
            href="/"
            className="font-serif font-bold text-xl lg:text-2xl 2xl:text-3xl"
          >
            JourneyVerse
          </Link>
        </div>

        <div className="relative flex items-center bg-white rounded-3xl">
          <input
            type="search"
            name="key"
            id="key"
            className="hidden outline-none text-black bg-inherit px-2 rounded-3xl"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Type Keywords"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute top-[2px] right-2 cursor-pointer text-black" />
        </div>

        {/* {isSearchOpen && <>
          onClick={()=>handleSearchDropdown()}
            <div className='z-20 w-[100%] h-screen fixed overflow-hidden scroll-none top-0 right-0 block bg-[#151515] h-min-screen'>
              <XMarkIcon className="h-6 w-6 cursor-pointer mx-auto mt-8" onClick={()=>handleSearchClose()}/>
              <div className='grid h-full place-content-center'>
                <p className='text-center mb-5'>Search for:</p>
                <input
                  type='search'
                  name='key'
                  id='key'
                  className='outline-none border-b bg-inherit px-1'
                  onChange={(e)=>handleSearch(e.target.value)}
                  placeholder='Type Keywords'
                />
              </div>
            </div>
          </>} */}
        {status != "loading" && user && (
          <div className="hidden md:block">
            <div
              className="relative leading-10"
              onMouseEnter={toggleProfileDropdown}
              onMouseLeave={toggleProfileDropdown}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                Hi, {name[0]}{" "}
                <ChevronDownIcon
                  className={`h-4 w-4 ${
                    isProfileDropdownOpen
                      ? "rotate-180 transition duration-300 ease-in-out"
                      : "transition duration-300 ease-in-out"
                  }`}
                />
              </div>
              {isProfileDropdownOpen && (
                <div className="absolute z-10 left-0 top-[25px] mt-2 py-2 w-36 bg-black rounded-md shadow-lg transform translate-y-1 transition-all ease-in-out duration-300">
                  <Link
                    href={`/profile/${user?.user?.username}`}
                    className="cursor-pointer block px-4 py-2 text-sm hover:text-white text-gray-400"
                  >
                    Profile
                  </Link>
                  <Link
                    href={`/create-post`}
                    className="cursor-pointer block px-4 py-2 text-sm hover:text-white text-gray-400"
                  >
                    Create a Post
                  </Link>
                  <p
                    onClick={() => signOut()}
                    className="cursor-pointer block px-4 py-2 text-sm hover:text-white text-gray-400"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {!user && (
          <div className="hidden md:block">
            <button onClick={() => signIn()} className="mr-2">
              Sign In
            </button>
            <Link
              href="/register"
              className="text-black bg-white border-0 px-2 py-1 rounded"
            >
              Sign Up
            </Link>
          </div>
        )}

        <HamburgerMenu />
      </div>

      <div className="hidden md:flex md:justify-center md:items-center container mx-auto py-1">
        <ul className="flex items-center justify-center gap-5">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li
            className="relative leading-10"
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            <div className="flex items-center gap-1 cursor-pointer">
              Categories{" "}
              <ChevronDownIcon
                className={`h-4 w-4 ${
                  isDropdownOpen
                    ? "rotate-180 transition duration-300 ease-in-out"
                    : "transition duration-300 ease-in-out"
                }`}
              />
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 left-0 top-[25px] mt-2 py-2 w-36 bg-black rounded-md shadow-lg transform translate-y-1 transition-all ease-in-out duration-300">
                <Link
                  className="block px-4 py-2 text-sm hover:text-white text-gray-400"
                  href="/category/travel"
                >
                  Travel
                </Link>
                <Link
                  className="block px-4 py-2 text-sm hover:text-white text-gray-400"
                  href="/category/food"
                >
                  Food
                </Link>
                <Link
                  className="block px-4 py-2 text-sm hover:text-white text-gray-400"
                  href="/category/technology"
                >
                  Technology
                </Link>
                <Link
                  className="block px-4 py-2 text-sm hover:text-white text-gray-400"
                  href="/category/fashion"
                >
                  Fashion
                </Link>
              </div>
            )}
          </li>

          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
