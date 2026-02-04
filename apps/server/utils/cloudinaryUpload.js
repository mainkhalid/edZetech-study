const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary from buffer
 * @param {Buffer} fileBuffer
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const uploadToCloudinary = (fileBuffer, options = {}) => {
  const { folder = 'uploads', maxWidth = 1920, maxHeight = 1080, format = 'auto', quality = 'auto' } = options;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        quality,
        format,
        transformation: [{ width: maxWidth, height: maxHeight, crop: 'limit' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        });
      }
    ).end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId
 * @returns {Promise<Object>}
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<Buffer>} fileBuffers
 * @param {Object} options
 * @returns {Promise<Array<Object>>}
 */
const uploadMultipleToCloudinary = async (fileBuffers, options = {}) => {
  try {
    return await Promise.all(fileBuffers.map(buffer => uploadToCloudinary(buffer, options)));
  } catch (error) {
    throw new Error(`Failed to upload multiple images: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
  cloudinary
};
