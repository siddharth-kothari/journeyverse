import BlogPostForm from "@/components/BlogPostForm";
import React from "react";
import { api } from "../api";

export const getCategory = async () => {
  const { data } = await api.get("/api/categories");
  return data;
};

const CreatePost = async () => {
  const { data } = await getCategory();

  return <BlogPostForm initialData={null} categories={data} />;
};

export default CreatePost;
