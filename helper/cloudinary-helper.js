const cloudinary = require('../config/coudinary');

// Function to upload image to Cloudinary
const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        throw new Error("Cloudinary upload failed");
    }
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error("Cloudinary delete failed");
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};
