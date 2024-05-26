"use server";

import { getServerSession } from "next-auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { api } from "@/app/api";
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
  checksum: string
) {
  const session = await getServerSession();

  //   const filename = `${Date.now()}_${file_name.replaceAll(" ", "_")}`;

  if (route != "register" && !session) {
    return { failure: "Not Authorised" };
  }

  if (filesize > maxFileSize) {
    return { failure: "File too large. Max 5MB is allowed" };
  }

  if (!acceptedTypes.includes(filetype)) {
    return { failure: "Invalid file type" };
  }

  const userid = session?.user?.id as unknown as string;
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME as string,
    Key: folder + "/" + filename,
    ContentLength: filesize,
    ContentType: filetype,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: userid,
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
    query: "SELECT title, slug FROM categories WHERE is_deleted != 1",
    data: [],
  });
  console.log(categories);

  return categories;
};
