// app/create-post/page.tsx
import React from "react";
import BlogPostForm from "@/components/BlogPostForm";
import { getCategory } from "@/actions";

const CreatePost = async () => {
  const data = await getCategory();

  return (
    <div>
      <BlogPostForm initialData={null} categories={data} />
    </div>
  );
};

export default CreatePost;
