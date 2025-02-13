const express = require("express");
const authMiddleware = require("../middleware/auth-middle");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
} = require("../controllers/image-controller");

const router = express.Router(); // Initialize router here

// Upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

// To get all the images
router.get("/get", authMiddleware, fetchImagesController);

// Delete image route
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;
