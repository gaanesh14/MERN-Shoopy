import mongoose from "mongoose";

const cartItemsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    name: String,
    image: String,
    price: String,
    color: String,
    size: String,
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    guestId: {
      type: String,
    },
    products: [cartItemsSchema],
    totalprice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);
const Cart = mongoose.model("cart", cartSchema);

export default Cart;
