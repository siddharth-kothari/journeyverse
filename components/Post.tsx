"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Post = ({ post }: any) => {
  const Content = { __html: post.content };
  console.log("post", post);
  return (
    <div className="max-w-5xl mx-auto my-14 lg:my-28">
      <div className="text-center">
        <div className="w-full my-20 h-[90%]">
          <img
            className="w-full"
            src={`${process.env.NEXT_PUBLIC_AWS_S3_URL}/blog-coverimage/${post.coverimage}`}
            alt={post.slug}
          />
        </div>
        <p className="font-serif font-bold text-4xl mb-4">{post.title}</p>
        <div className="flex justify-center items-center gap-6">
          <p className=" font-light font-sans text-gray-500">
            {new Date(post.published_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-gray-500">
            By <span className="text-black">{post.author_name}</span>
          </p>
        </div>
      </div>

      <div id="post-content" className="mt-20">
        <div className="w-full 2xl:w-[90%] mx-auto">
          <div dangerouslySetInnerHTML={Content} />

          <div className="block md:flex justify-between items-center my-14">
            <div>
              <p className="uppercase font-base font-sans font-[500] leading-10 tracking-widest">
                posted in:
              </p>
              <Link
                className="text-gray-500 hover:text-black"
                href={`/category/${post.cat_slug}`}
              >
                {post.category}
              </Link>
            </div>

            <div>
              <p className="uppercase font-base font-sans font-[500] leading-10 tracking-widest">
                tags:
              </p>
              <p>{post.keywords}</p>
            </div>
          </div>

          <div
            id="author"
            className=" w-full block md:flex border-slate-300 justify-start gap-4 border p-9 text-center md:text-left"
          >
            <div className="md:w-[50%] rounded-full">
              <img
                className="w-[100px] mx-auto rounded-[50%]"
                src={`${process.env.NEXT_PUBLIC_AWS_S3_URL}/users/${post.author_image}`}
                alt={post.author_name}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
            <div className="block">
              <div>
                <p className="uppercase text-gray-500 text-sm font-sans font-thin leading-8 tracking-widest">
                  posted by
                </p>
                <p className="font-bold font-sans mb-2">{post.author_name}</p>
              </div>
              <div className="text-gray-500 font-[250]">{post.author_bio}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
