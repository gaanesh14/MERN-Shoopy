import express from "express";
import Order from "../models/orderModel.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// @router GET /api/orders/my-orders
// @access Get logged-in user's orders
// @access private

router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route.GET /api/orders/:id
// @desc GET order details by ID
// @access private

router.get("/:id", protect, async (req, res) => {
  try {
    const orders = await Order.findById(req.params.id).populate("user", "name");
    if (!orders) {
      return res.status(404).json({ message: "Order not found!" });
    }
    res.json(orders);
  } catch (error) {
    console.error("the error is:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      // any other fields you pass from frontend
    } = req.body;

    // Validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: "Processing",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating order" });
  }
});

export default router;
