import path from "path";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { NextResponse } from "next/server";
import Cors from "cors"; // Import cors middleware

// Initialize the cors middleware
const cors = Cors({
  methods: ["POST"], // Only allow POST method
});

// Get the directory name of the current module file
const __dirname = dirname(fileURLToPath(import.meta.url));

export const POST = async (req: Request) => {
  const formData: any = await req.formData();

  const file = formData.get("files");
  if (!file) {
    return NextResponse.json({ data: "", status: 200 }, { status: 200 });
  }

  // Check file type (optional)
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedMimeTypes.includes(file.type)) {
    return NextResponse.json(
      { message: "Unsupported file type.", status: 415 },
      { status: 415 }
    );
  }

  // Read the file contents using fs
  const fileContents = await file.arrayBuffer();

  // Generate a unique filename
  const filename = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;

  try {
    await writeFile(
      path.join(__dirname, "../../../public/uploads/", filename),
      Buffer.from(fileContents)
    );
    return NextResponse.json({
      data: filename,
      message: "File uploaded successfully.",
      status: 200,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Failed to upload file.", status: 500 });
  }
};
