const { uploadToCloudinary } = require('../helper/cloudinary-helper');

// console.log("Received file path:", req.file.path); // Log the file path

const cloudinary = require('../config/coudinary');
const Image = require('../model/image');
const fs= require('fs');
// Upload Image Controller
const uploadImageController = async(req,res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required. Please upload an image",
            });
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path);
        console.log("Upload result:", { url, publicId }); // Log the upload result
        const newlyUploadedImage = new Image({
            url,
            publicId,

            uploadedBy: req.userInfo.userId,
        });
        await newlyUploadedImage.save();
        // fs.unlinkSync(req.file.path); // Delete the file from the server
        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            image: newlyUploadedImage,
        });
    } catch (err) {
        console.log("Something went wrong ", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error at uploading image"
        });
    }
}

// Fetch Images Controller
const fetchImagesController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page -1)* limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        if(images){
        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages : totalPages,
            totalImages: totalImages,
            data : images,
        });
    }
    } catch (err) {
        console.log("Something went wrong ", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error at fetching images"
        });
    }
}

// Delete Image Controller
const deleteImageController = async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findById(id);
        const userId = req.userInfo.userId;
         if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }
        if(image.uploadedBy.toString()!== userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this image"
            });
        }
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.publicId);
        // Delete from database
        await Image.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        });
    } catch (err) {
        console.log("Something went wrong", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController,
};
