import React from "react";
import { IQueryOptions } from "@/typing";
import { api } from "@/app/api";
import Image from "next/image";
import UserProfile from "@/components/UserProfile";
import { getUserProfile, getUserPosts } from "@/actions";
import AllBlogs from "@/components/AllBlogs";

// export const getUser = async ({ slug }: any) => {
//   const res = api.get(`api/user/${slug}`);
//   return res;
// };

const Profile = async ({ params }: any) => {
  const { slug } = params;

  const data = await getUserProfile(slug);
  const user = data[0];

  // const user = data.data;
  const posts = await getUserPosts(user.id);

  return (
    <div>
      <UserProfile user={user} />
      <p className="mx-5 font-bold mt-5 underline decoration-slate-400 underline-offset-4">
        Published Posts
      </p>
      <AllBlogs posts={posts} />
    </div>
  );
};

export default Profile;
