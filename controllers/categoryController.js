import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('parent', 'name slug').sort('name');
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name slug');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, parent } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const category = await Category.create({ name, description, image, parent: parent || null });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description !== undefined ? req.body.description : category.description;
    category.parent = req.body.parent !== undefined ? req.body.parent : category.parent;

    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    }

    const updated = await category.save();
    res.json({ success: true, category: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
