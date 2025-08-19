const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images stock isActive');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Filter out inactive products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    
    // Recalculate totals if items were filtered
    await cart.save();

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more items than available stock'
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();

    // Populate and return updated cart
    await cart.populate('items.product', 'name price images stock isActive');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );
    } else {
      // Validate product and stock
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available'
        });
      }

      // Update item quantity
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price;
      } else {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock isActive');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item from cart
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock isActive');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get cart item count
// @route   GET /api/cart/count
// @access  Private
router.get('/count', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const count = cart ? cart.totalItems : 0;

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;