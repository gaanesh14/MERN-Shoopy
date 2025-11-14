import express from "express";
import checkOut from "../models/checkOutModel.js";
import Products from "../models/productModels.js";
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
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await checkOut.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // ✅ Validate quantity before saving
    // const hasInvalidQuantity = checkout.checkoutItems.some(
    //   (item) => !item.quantity
    // );
    // if (hasInvalidQuantity) {
    //   return res
    //     .status(400)
    //     .json({
    //       message: "One or more checkout items are missing a valid quantity",
    //     });
    // }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = new Date();
      await checkout.save();
      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/checkout/:id/finalize
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await checkOut.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // if (checkout.isPaid && !checkout.isFinalized) {
    //   // Validate quantity
    //   const hasInvalidQuantity = checkout.checkoutItems.some(
    //     (item) => !item.quantity
    //   );
    //   if (hasInvalidQuantity) {
    //     return res
    //       .status(400)
    //       .json({ message: "One or more items have missing quantity" });
    //   }

      const finalOrder = await orders.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems, // ✅ use proper field
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    }
    catch (error) {
    console.error("Error finalizing checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
})


export default router;
