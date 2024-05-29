import { getSinglePost } from "@/actions";
import Post from "@/components/Post";
import React from "react";

const SinglePostPage = async ({ params }: any) => {
  const { slug } = params;

  const data = await getSinglePost(slug);

  return <Post post={data[0]} />;
};

export default SinglePostPage;
