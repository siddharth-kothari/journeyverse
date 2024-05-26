"use client";

import { api } from "@/app/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface Errors {
  title?: string;
  category?: number;
  name?: string;
  email?: string;
  confirmPassword?: string;
  profilePicture?: string;
  location?: string;
  bio?: string;
}

const BlogPostForm = ({ initialData, categories }: any) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const { data: session, status } = useSession();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-screen-lg mx-auto my-10">
        <div className="flex justify-between items-center gap-4">
          <div className="mb-4 w-full">
            <label
              htmlFor="title"
              className="block text-black text-sm font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className={`w-full px-3 py-2 border bg-inherit text-black rounded-md outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div className="mb-4 w-full">
            <label
              htmlFor="title"
              className="block text-black text-sm font-medium mb-2"
            >
              Category
            </label>
            <select
              id="category"
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 border bg-inherit text-black rounded-md outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={0}>Select Blog Category</option>
              {categories &&
                Array.isArray(categories) &&
                categories.map((category: any, index: number) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
