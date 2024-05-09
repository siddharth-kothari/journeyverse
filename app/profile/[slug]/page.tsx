import React from "react";
import { IQueryOptions } from "@/typing";
import { api } from "@/app/api";
import Image from "next/image";
import UserProfile from "@/components/UserProfile";

// export const getUser = async({ slug }:any) =>{

//   const options = {
//     populate:[ 'posts.category', 'posts.MainImage','image','posts.Author.image']
//   }

//   const queryString = qs.stringify(options);

//   //console.log("queryString",queryString);

//   const res = api.get(`/slugify/slugs/user/${slug}?${queryString}`)
//   return res;

// }

const Profile = async ({ params }: any) => {
  const { slug } = params;

  //const { data } = await getUser({ slug });

  // console.log(data);

  // const user = data.data;
  // const posts = user.attributes.posts.data;

  // console.log('posts1',posts);
  return (
    <div>
      <UserProfile />
      <p className="mx-5 font-bold mt-5 underline decoration-slate-400 underline-offset-4">
        Published Posts
      </p>
      {/* <AllBlogs posts={posts} /> */}
    </div>
  );
};

export default Profile;
