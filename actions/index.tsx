"use server";

import { getServerSession } from "next-auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { query } from "@/config/db";

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_KEY as string,
  },
});

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const maxFileSize = 1024 * 1024 * 5; //5MB

export async function getSignedURL(
  route: string,
  folder: string,
  filename: string,
  filetype: string,
  filesize: number,
  checksum: string,
  userid?: number
) {
  const session = await getServerSession();

  // if (route != "register" && !userid) {
  //   return { failure: "Not Authorised" };
  // }

  if (filesize > maxFileSize) {
    return { failure: "File too large. Max 5MB is allowed" };
  }

  if (!acceptedTypes.includes(filetype)) {
    return { failure: "Invalid file type" };
  }

  const id = userid as unknown as string;
  console.log("iddddddd", id);

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME as string,
    Key: folder + "/" + filename,
    ContentLength: filesize,
    ContentType: filetype,
    ChecksumSHA256: checksum,
    Metadata: {
      //userid: id,
      route: route,
    },
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 300,
  });
  return { success: { url: signedURL, filename: filename } };
}

export const getCategory = async () => {
  const categories = await query({
    query: "SELECT id, title, slug FROM categories WHERE is_deleted != 1",
    data: [],
  });

  return categories;
};

export const createPost = async (data: any) => {
  const res = JSON.parse(data);
  console.log("dataaaaa", res.title);
  let slug = res.title.toLowerCase();

  // Remove special characters (keep alphanumeric and spaces)
  slug = slug.replace(/[^a-z0-9\s-]/g, "");

  // Replace spaces and multiple hyphens with a single hyphen
  slug = slug.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
  const post = await query({
    query:
      "INSERT INTO posts(title,slug,content,category_id,author_id,thumbnail,coverimage,keywords,excerpt) VALUES (?,?,?,?,?,?,?,?,?)",
    data: [
      res.title,
      slug,
      res.content,
      res.category,
      res.userid,
      res.thumbnail_name,
      res.coverimage_name,
      res.keywords,
      res.excerpt,
    ],
  });

  return post;
};

export const getUserProfile = async (slug: string) => {
  const user = await query({
    query: "SELECT * FROM users WHERE username = ?",
    data: [slug],
  });

  return user;
};

export const getUserPosts = async (id: number) => {
  const posts = await query({
    query:
      "SELECT p.*,c.title as category FROM posts p JOIN categories c ON c.id = p.category_id WHERE author_id = ? and p.is_deleted != 1",
    data: [id],
  });

  return posts;
};

export const getAllPosts = async () => {
  const posts = await query({
    query:
      "SELECT p.*,c.title as category FROM posts p JOIN categories c ON c.id = p.category_id WHERE p.is_deleted != 1",
    data: [],
  });

  return posts;
};
