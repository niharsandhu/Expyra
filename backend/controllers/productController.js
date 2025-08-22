const multer = require('multer');
const { extractProductDetailsFromImage } = require('../utils/geminiUtils');
const Product = require('../models/productModel');
const UserProduct = require('../models/userProductModel');
const cloudinary = require("cloudinary").v2;


// === Setup multer to store file in memory ===
const upload = multer({ storage: multer.memoryStorage() });

// === Cloudinary Config ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === Controller ===
const scanProduct = async (req, res) => {
  try {
    const userId = req.user?._id; // ⚠️ requires auth middleware
    if (!req.file || !userId) {
      return res
        .status(400)
        .json({ error: "Image file and user authentication are required" });
    }

    // Convert uploaded buffer to base64
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(fileBase64, {
      folder: "scanned_products",
    });

    const imgLink = uploadRes.secure_url;

    // Extract product details from OCR
    let details = {};
    try {
      details = await extractProductDetailsFromImage(req.file.buffer.toString("base64"));
    } catch (err) {
      console.warn("OCR failed:", err.message);
      details = { name: null, productType: "Unknown", brand: "Unknown", expiryDate: null };
    }

    const { name, productType = "Unknown", brand = "Unknown", expiryDate } = details;

    if (!name || !expiryDate) {
      return res.status(400).json({
        error: "Could not detect product name or expiry date. Please upload a clearer image.",
      });
    }

    // Find existing product
    let product = await Product.findOne({ name, brand, productType });

    if (!product) {
      product = await Product.create({ name, brand, productType, imageUrl: imgLink });
    }

    // Prevent duplicate UserProduct
    let userProduct = await UserProduct.findOne({ user: userId, product: product._id });
    if (!userProduct) {
      userProduct = await UserProduct.create({
        user: userId,
        product: product._id,
        expiryDate,
      });
    }

    res.status(200).json({
      message: "Product scanned successfully",
      product,
      userProduct,
      details,
    });
  } catch (error) {
    console.error("Scan error:", error.response?.data || error.message);
    res.status(500).json({ error: "Scan failed" });
  }
};


// Get all products for a user
const getAllUserProducts = async (req, res) => {
  try {
    // ⚠️ req.user._id requires auth middleware
    const userProducts = await UserProduct.find({ user: req.user._id })
      .populate('product', 'name brand imageUrl'); // also populate imageUrl

    // Filter out entries where product is null
    const formattedProducts = userProducts
      .filter(up => up.product) // remove null products
      .map(up => ({
        name: up.product.name,
        brand: up.product.brand,
        expiryDate: up.expiryDate,
        imageUrl: up.product.imageUrl || null,
      }));

    res.status(200).json({ success: true, products: formattedProducts });
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// ✅ Export everything in one object
module.exports = {
  upload: upload.single('image'),
  scanProduct,
  getAllUserProducts
};
