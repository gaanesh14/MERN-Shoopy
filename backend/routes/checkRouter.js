import express from "express";
import checkOut from "../models/checkOutModel.js";
import orders from "../models/orderModel.js";
import { protect } from "../Middleware/authMiddleware.js";
import Cart from "../models/cartModels.js";

const router = express.Router();

// @route POST /api/checkout
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const newCheckout = await checkOut.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @route PUT /api/checkout/:id/pay
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await checkOut.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Prevent double payment
    if (checkout.isPaid) {
      return res.status(400).json({ message: "Checkout already paid" });
    }

    if (paymentStatus !== "paid") {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // Mark checkout as paid
    checkout.isPaid = true;
    checkout.paymentStatus = "paid";
    checkout.paymentDetails = paymentDetails;
    checkout.paidAt = new Date();
    await checkout.save();

    // Create Order
    const finalOrder = await orders.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "paid",
      paymentDetails: checkout.paymentDetails,
    });

    //  Delete Cart
    await Cart.findOneAndDelete({ user: checkout.user });

    // Optional: Delete checkout session
    await checkOut.findByIdAndDelete(checkout._id);

    // Return ORDER (important)
    res.status(200).json(finalOrder);

  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
