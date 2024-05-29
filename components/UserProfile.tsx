"use client";

import { IUser } from "@/typing";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
interface IPropType {
  user: IUser;
}

const UserProfile = ({ user }: any) => {
  // console.log('user',user);
  return (
    <div className="w-full lg:w[70%]">
      <div className="m-5 flex justify-between items-center">
        <img
          className="w-[100px] md:w-[150px]"
          src={`${process.env.NEXT_PUBLIC_AWS_S3_URL}/users/${user.image}`}
          alt={`image of ${user.name}`}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
            e.currentTarget.onerror = null;
          }}
        />

        <div>
          <Link
            href="/profile/edit-profile"
            className="border border-black rounded-lg p-2"
          >
            Edit Profile
          </Link>
        </div>
      </div>
      <div className="mx-5">
        <p className="font-bold text-xl mb-3">{user.name}</p>
        <div className="flex gap-3 mb-3">
          <MapPinIcon className="h-5 w-5" />
          <p>{user.location}</p>
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: user.bio }}
          className="text-gray-600 font-sans font-light"
        ></div>
      </div>
    </div>
  );
};

export default UserProfile;
