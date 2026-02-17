import express from "express";
import Order from "../models/orderModel.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/admin/orders
// @desc get all orders (admin only)

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
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
// @route PUT /api/admin/orders/:id
// @desc update order status

router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "Delivered" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

export default router;
