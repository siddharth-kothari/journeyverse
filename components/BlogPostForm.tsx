"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { computeSHA256 } from "@/utils";
import { getSignedURL } from "@/actions";

const BlogEditor = dynamic(() => import("./BlogEditor"), {
  ssr: false,
});

interface Errors {
  title?: string;
  category?: string;
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

  var userid = session?.user?.id;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Add form submission logic here

    const validationErrors: Errors = {};
    if (title.trim() === "") {
      validationErrors.title = "Title is required";
    }
    if (category.trim() === "") {
      validationErrors.category = "Category is required";
    }
    if (content.trim() === "") {
      validationErrors.content = "Content is required";
    }
    if (excerpt.trim() === "") {
      validationErrors.excerpt = "Excerpt is required";
    }
    if (keywords.trim() === "") {
      validationErrors.keywords = "Keywords are required";
    }

    if (!thumbnail) {
      validationErrors.thumbnail = "Thumbnail is required";
    }

    if (!coverimage) {
      validationErrors.coverimage = "Cover Image is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    var thumbnail_name;
    var coverimage_name;
    const checksum1 = await computeSHA256(thumbnail);

    thumbnail_name = `${Date.now()}_${thumbnail?.name.replaceAll(" ", "_")}`;
    const signedURLResult = await getSignedURL(
      "add_blog",
      "blog-thumbnail",
      thumbnail_name,
      thumbnail?.type as string,
      thumbnail?.size as number,
      checksum1,
      userid
    );

    if (signedURLResult.failure !== undefined) {
      console.error(signedURLResult.failure);
      alert(signedURLResult.failure);
      return;
    }

    const url = signedURLResult.success.url;
    var thumbnail_res;
    thumbnail_res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": thumbnail?.type as string,
      },
      body: thumbnail,
    });

    if (typeof thumbnail_res === "undefined" || thumbnail_res?.status === 200) {
      const checksum = await computeSHA256(coverimage);

      coverimage_name = `${Date.now()}_${coverimage?.name.replaceAll(
        " ",
        "_"
      )}`;
      const signedURLResult = await getSignedURL(
        "add_blog",
        "blog-coverimage",
        coverimage_name,
        coverimage?.type as string,
        coverimage?.size as number,
        checksum,
        userid
      );

      if (signedURLResult.failure !== undefined) {
        console.error(signedURLResult.failure);
        alert(signedURLResult.failure);
        return;
      }

      const url = signedURLResult.success.url;
      var coverimage_res;
      coverimage_res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": coverimage?.type as string,
        },
        body: coverimage,
      });

      if (
        typeof coverimage_res === "undefined" ||
        coverimage_res?.status == 200
      ) {
        console.log("test");
      } else {
        alert(thumbnail_res?.status + " " + thumbnail_res?.statusText);
      }
    } else {
      alert(thumbnail_res?.status + " " + thumbnail_res?.statusText);
    }
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
          <label
            htmlFor="content"
            className="block text-black text-sm font-medium mb-2"
          >
            Content
          </label>
          {isClient && <BlogEditor content={content} setContent={setContent} />}
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
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
                className="mt-2 w-full h-[200px] border rounded-lg object-fill object-center"
              />
            ) : (
              <>
                <div
                  className={`w-full h-[200px] border rounded-lg bg-white relative ${
                    errors.thumbnail ? "border-red-500" : "border-gray-300"
                  }`}
                >
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
                className="mt-2 w-full h-[200px] border rounded-lg object-fit object-center"
              />
            ) : (
              <>
                <div
                  className={`w-full h-[200px] border rounded-lg bg-white relative ${
                    errors.coverimage ? "border-red-500" : "border-gray-300"
                  }`}
                >
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

        <div className="w-full flex">
          <button
            type="submit"
            className=" w-max mx-auto bg-black text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
