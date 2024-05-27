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
