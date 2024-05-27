"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BlogEditor = dynamic(() => import("./BlogEditor"), {
  ssr: false,
});

interface Errors {
  title?: string;
  category?: number;
  content?: string;
  excerpt?: string;
  keywords?: string;
  thumbnail?: string;
  coverimage?: string;
}

const BlogPostForm = ({ initialData, categories }: any) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [keywords, setKeywords] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [coverimage, setCoverimage] = useState<File | null>(null);
  const [coverimagePreview, setCoverimagePreview] = useState<string | null>(
    null
  );
  const [errors, setErrors] = useState<Errors>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  const { data: session, status } = useSession();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Add form submission logic here
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isClient) {
    // Optionally, you can return a loading state or null during the server-side render
    return null;
  }

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
              className={`w-full px-3 py-2 border bg-white text-black rounded-md outline-none ${
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
              htmlFor="category"
              className="block text-black text-sm font-medium mb-2"
            >
              Category
            </label>
            <select
              id="category"
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 border bg-white text-black rounded-md outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option key={0} value={0}>
                Select Blog Category
              </option>
              {categories &&
                categories.map((category: any) => (
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

        <div className="mb-4 w-full">
          {isClient && <BlogEditor content={content} setContent={setContent} />}
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="mb-4 w-full">
            <label
              htmlFor="thumbnail"
              className="block text-black text-sm font-medium mb-2"
            >
              Thumbnail
            </label>
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="mt-2 w-32 h-32 object-fill object-center rounded-[50%]"
              />
            ) : (
              <>
                <div className="w-full h-[200px] border rounded-lg bg-white relative">
                  <label
                    className="absolute bottom-0 overflow-hidden text-center cursor-pointer hover:cursor-pointer w-full h-[200px] flex justify-center items-center text-black"
                    htmlFor="thumbnail"
                  >
                    Browse
                  </label>
                </div>
              </>
            )}

            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              className="absolute bottom-0 overflow-hidden opacity-0"
              onChange={(e) =>
                handleFileChange(e, setThumbnail, setThumbnailPreview)
              }
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
            )}
          </div>
          <div className="mb-4 w-full">
            <label
              htmlFor="coverimage"
              className="block text-black text-sm font-medium mb-2"
            >
              Cover Image
            </label>
            {coverimagePreview ? (
              <img
                src={coverimagePreview}
                alt="Cover Image Preview"
                className="mt-2 w-32 h-32 object-fill object-center rounded-[50%]"
              />
            ) : (
              <>
                <div className="w-full h-[200px] border rounded-lg bg-white relative">
                  <label
                    className="absolute bottom-0 overflow-hidden text-center cursor-pointer hover:cursor-pointer w-full h-[200px] flex justify-center items-center text-black"
                    htmlFor="coverimage"
                  >
                    Browse
                  </label>
                </div>
              </>
            )}

            <input
              type="file"
              id="coverimage"
              accept="image/*"
              className="absolute bottom-0 overflow-hidden opacity-0"
              onChange={(e) =>
                handleFileChange(e, setCoverimage, setCoverimagePreview)
              }
            />
            {errors.coverimage && (
              <p className="text-red-500 text-sm mt-1">{errors.coverimage}</p>
            )}
          </div>
        </div>
        <div className="mb-4 w-full">
          <label
            htmlFor="excerpt"
            className="block text-black text-sm font-medium mb-2"
          >
            Excerpt
          </label>
          <input
            type="text"
            id="excerpt"
            className={`w-full px-3 py-2 border bg-white text-black rounded-md outline-none ${
              errors.excerpt ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          {errors.excerpt && (
            <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
          )}
        </div>
        <div className="mb-4 w-full">
          <label
            htmlFor="keywords"
            className="block text-black text-sm font-medium mb-2"
          >
            Keywords (For SEO)
          </label>
          <input
            type="text"
            id="keywords"
            className={`w-full px-3 py-2 border bg-white text-black rounded-md outline-none ${
              errors.keywords ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          {errors.keywords && (
            <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
