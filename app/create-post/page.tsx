// app/create-post/page.tsx
import React from "react";
import BlogPostForm from "@/components/BlogPostForm";
import { api } from "../api";

export const getCategory = async () => {
  const { data } = await api.get("/api/categories");
  return data;
};

const CreatePost = async () => {
  const data = await getCategory();

  return (
    <div>
      <h1>Create Post</h1>
      <BlogPostForm initialData={null} categories={data} />
    </div>
  );
};

export default CreatePost;
