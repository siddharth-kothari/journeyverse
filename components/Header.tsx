"use client";

import React, { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamBurgerMenu";
import Link from "next/link";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { api } from "@/app/api";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/categories");
        console.log("categories", data); // Ensure that the fetched data is correct
        setCategories(data); // Set categories directly
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const { data: session, status } = useSession();

  const user: any = session?.user;
  const name = user?.name.split(" ") ?? "User";
  const letter = user?.name.charAt(0);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSearch = (keyword: string) => {
    setTimeout(() => {
      router.push(`/?search=${keyword}`);
    }, 1000);
  };

  if (status === "loading") {
    return <Loading />;
  }

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

        {status === "authenticated" && user && (
          <div className="hidden md:block">
            <div
              className="relative leading-10"
              onMouseEnter={toggleProfileDropdown}
              onMouseLeave={toggleProfileDropdown}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                <div className="flex items-center gap-3 cursor-pointer">
                  <img
                    src={`${process.env.NEXT_PUBLIC_AWS_S3_URL}/users/${user.image}`}
                    alt="user image"
                    className="rounded-[50%] w-10 h-10 object-fill"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                      e.currentTarget.onerror = null;
                    }}
                  />
                  Hi, {name[0]}
                </div>
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
                    href={`/profile/${user.username}`}
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
            <Link href="/login" className="mr-2">
              Sign In
            </Link>
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
            {isDropdownOpen && categories && Array.isArray(categories.data) && (
              <div className="absolute z-10 left-0 top-[25px] mt-2 py-2 w-36 bg-black rounded-md shadow-lg transform translate-y-1 transition-all ease-in-out duration-300">
                {categories.data.map((category: any, index: number) => (
                  <Link
                    key={index + 1}
                    href={`/category/${category.slug}`}
                    className="block px-4 py-2 text-sm hover:text-white text-gray-400"
                  >
                    {category.title}
                  </Link>
                ))}
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
