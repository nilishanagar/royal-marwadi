import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone });

    const token = generateToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile (name, email, phone)
// @route   PUT /api/auth/update-profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;

    const updatedUser = await user.save();
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add/update address
// @route   PUT /api/auth/addresses
export const updateAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { address, addressId } = req.body;

    if (addressId) {
      // Update existing address
      const idx = user.addresses.findIndex((a) => a._id.toString() === addressId);
      if (idx !== -1) {
        user.addresses[idx] = { ...user.addresses[idx].toObject(), ...address };
      }
    } else {
      // Add new address
      if (address.isDefault) {
        user.addresses.forEach((a) => (a.isDefault = false));
      }
      user.addresses.push(address);
    }

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:addressId
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (a) => a._id.toString() !== req.params.addressId
    );
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};
