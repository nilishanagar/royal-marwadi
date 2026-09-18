import Product from '../models/Product.js';
import ApiFeatures from '../utils/apiFeatures.js';

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    // Get total count for pagination metadata
    const countQuery = new ApiFeatures(Product.find(), req.query).search().filter();
    const totalProducts = await Product.countDocuments(countQuery.query.getFilter());

    const features = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query.populate('category', 'name slug');

    res.json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / features.limit),
      currentPage: features.page,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const products = await Product.find({ featured: true })
      .limit(limit)
      .populate('category', 'name slug');

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, richDescription, price, compareAtPrice,
      category, stock, material, dimensions, color, weight, featured, tags,
    } = req.body;

    // Handle uploaded images
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
      name, description, richDescription, price, compareAtPrice,
      category, images, stock, material, dimensions: dimensions ? JSON.parse(dimensions) : {},
      color, weight, featured, tags: tags ? JSON.parse(tags) : [],
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      // Merge with existing if keepExisting flag, otherwise replace
      if (req.body.keepExistingImages === 'true') {
        updates.images = [...product.images, ...newImages];
      } else {
        updates.images = newImages;
      }
    }

    if (updates.dimensions && typeof updates.dimensions === 'string') {
      updates.dimensions = JSON.parse(updates.dimensions);
    }
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = JSON.parse(updates.tags);
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
export const addReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      title,
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};
