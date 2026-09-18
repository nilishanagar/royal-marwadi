import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems, shippingAddress, paymentMethod,
      itemsPrice, taxPrice, shippingPrice, totalPrice, notes,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      notes,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      orders,
      totalOrders: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    if (req.body.status === 'Confirmed' && order.paymentMethod === 'COD') {
      // COD orders are marked paid on confirmation
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/pay
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.updateTime,
      email: req.body.email,
    };

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
export const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        deliveredOrders,
        processingOrders,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
