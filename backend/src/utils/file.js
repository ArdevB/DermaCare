import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary.js"; // ensures cloudinary.config() has run before any upload/delete call

const CLOUDINARY_FOLDER = "DermaCare";

async function uploadFile(files) {
  const uploadedFiles = [];
  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: CLOUDINARY_FOLDER }, (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(result);
          }
        })
        .end(file.buffer);
    });
    uploadedFiles.push(result);
  }
  return uploadedFiles;
}

async function deleteFile(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      `Failed to delete Cloudinary file ${publicId}:`,
      error.message,
    );
  }
}

export { uploadFile, deleteFile };
