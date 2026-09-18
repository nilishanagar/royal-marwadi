import User from '../models/User.js';

// @desc    Get all users (Admin)
// @route   GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort('-createdAt').skip(skip).limit(limit);

    res.json({
      success: true,
      users,
      totalUsers: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = req.body.role || user.role;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    next(error);
  }
};
