import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_FOLER = "DermaCare";

async function uploadFile(files) {
  const uploadedFiles = [];
  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: CLOUDINARY_FOLER }, (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(result);
          }
        })
        .end(file.buffer);
    });
    uploadResults.push(result);
  }
  return uploadedFiles;
}

export default uploadFile;
