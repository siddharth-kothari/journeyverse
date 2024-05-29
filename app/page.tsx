import { getAllPosts } from "@/actions";
import AllBlogs from "@/components/AllBlogs";
import Image from "next/image";

export default async function Home() {
  const posts = await getAllPosts();
  return <AllBlogs posts={posts} />;
}
