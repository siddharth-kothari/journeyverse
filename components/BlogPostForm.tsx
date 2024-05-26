"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import FroalaEditor and its plugins
const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), {
  ssr: false,
});

const BlogPostForm = ({ initialData, categories }: any) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check if the window is defined to ensure client-side execution
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      // Dynamically import Froala plugins on the client side
      import("froala-editor/js/plugins/image.min.js");
      import("froala-editor/js/plugins/font_family.min.js");
      import("froala-editor/js/plugins/char_counter.min.js");
      import("froala-editor/js/plugins/align.min.js");
      import("froala-editor/js/plugins/colors.min.js");
      import("froala-editor/js/plugins/emoticons.min.js");
      import("froala-editor/js/plugins/font_size.min.js");
      import("froala-editor/js/plugins/line_height.min.js");
      import("froala-editor/js/plugins/link.min.js");
      import("froala-editor/js/plugins/lists.min.js");
      import("froala-editor/js/plugins/paragraph_format.min.js");
      import("froala-editor/js/plugins/quote.min.js");
      import("froala-editor/js/plugins/paragraph_style.min.js");
      import("froala-editor/js/plugins/special_characters.min.js");
      import("froala-editor/js/third_party/spell_checker.min.js");
      import("froala-editor/js/plugins/table.min.js");
      import("froala-editor/css/froala_style.min.css");
      import("froala-editor/css/froala_editor.pkgd.min.css");
    }
  }, [isClient]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Add form submission logic here
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
              htmlFor="category"
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

        <div className="mb-4 w-full">
          {isClient && (
            <FroalaEditor
              model={content}
              onModelChange={(e: string) => setContent(e)}
              config={{
                placeholderText: "Write...",
                charCounterCount: true,
              }}
              tag="textarea"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
