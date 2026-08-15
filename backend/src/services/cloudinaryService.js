import cloudinary from "../config/cloudinary.js";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/**
 * Uploads a single image buffer to Cloudinary.
 * @param {Buffer} fileBuffer
 * @param {string} [folder]
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = (fileBuffer, folder = config.cloudinary.folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload failed: ${error.message}`);
          return reject(
            ApiError.internal("Image upload failed. Please try again."),
          );
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(fileBuffer);
  });
};

/** Uploads multiple images in parallel. */
export const uploadImages = async (
  files,
  folder = config.cloudinary.folder,
) => {
  return Promise.all(files.map((file) => uploadImage(file.buffer, folder)));
};

/** Deletes a single image by its Cloudinary public_id. Never throws on "already gone". */
export const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Log but don't block the calling operation (e.g. product update) on a cleanup failure.
    logger.error(`Cloudinary delete failed for ${publicId}: ${error.message}`);
  }
};

/** Deletes multiple images. */
export const deleteImages = async (publicIds = []) => {
  await Promise.all(publicIds.map((id) => deleteImage(id)));
};

/** Replaces an old image with a newly uploaded one; deletes the old asset after a successful upload. */
export const replaceImage = async (
  fileBuffer,
  oldPublicId,
  folder = config.cloudinary.folder,
) => {
  const uploaded = await uploadImage(fileBuffer, folder);
  if (oldPublicId) {
    await deleteImage(oldPublicId);
  }
  return uploaded;
};
