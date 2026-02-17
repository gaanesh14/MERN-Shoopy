import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../Redux/slices/productSlice";
import { addToCart } from "../../Redux/slices/cartSlice";

function ProductDetails({ productId }) {
  const [mainImage, setMainImage] = useState("");
  const [selectSize, setSelectSize] = useState("");
  const [selectColor, setSelectColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisable, setIsButtonDisable] = useState(false);

  const { id: routeId } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products,
  );
  const { user, guestId } = useSelector((state) => state.auth);

  // Memoize the product ID to prevent unnecessary re-renders and dispatches
  const productFetchId = useMemo(
    () => productId || routeId,
    [productId, routeId],
  );

  useEffect(() => {
    // Check for a valid MongoDB ObjectId length before dispatching
    if (productFetchId && productFetchId.trim().length === 24) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
    } else {
      console.warn("No valid product ID provided to ProductDetails component!");
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    // Set the main image and reset options when a new product is loaded
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
      setSelectSize("");
      setSelectColor("");
      setQuantity(1);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (selectedProduct?.countInStock === 0) return;

    if (action === "plus") {
      setQuantity((prev) => Math.min(prev + 1, selectedProduct.countInStock));
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) {
      toast.error("Product not loaded yet.", { duration: 1000 });
      return;
    }

    // Check if color/size is required but not selected
    if (selectedProduct.color?.length > 0 && !selectColor) {
      toast.error("Please select a color.", { duration: 1000 });
      return;
    }

    if (selectedProduct.size?.length > 0 && !selectSize) {
      toast.error("Please select a size.", { duration: 1000 });
      return;
    }

    if (quantity > selectedProduct.countInStock) {
      toast.error(`Only ${selectedProduct.countInStock} items are in stock.`, {
        duration: 1000,
      });
      return;
    }

    if (quantity <= 0) {
      toast.error("Quantity must be at least 1.", { duration: 1000 });
      return;
    }

    setIsButtonDisable(true);

    try {
      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedProduct.size?.length > 0 ? selectSize : undefined,
          color: selectedProduct.color?.length > 0 ? selectColor : undefined,
          guestId,
          userId: user?._id,
        }),
      ).unwrap();
      toast.success("Product added to cart!", { duration: 1000 });
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart.", { duration: 1000 });
    } finally {
      setIsButtonDisable(false);
      setSelectColor("");
      setSelectSize("");
      setQuantity(1);
    }
  };

  // Condition to disable the Add to Cart button
  const isAddToCartDisabled =
    isButtonDisable ||
    selectedProduct?.countInStock === 0 ||
    (selectedProduct?.color?.length > 0 && !selectColor) ||
    (selectedProduct?.size?.length > 0 && !selectSize);

  if (loading) {
    return <p className="text-center p-5">Loading product details... ⌛</p>;
  }

  if (error) {
    return <p className="text-center p-5 text-red-500">Error: {error} 🙁</p>;
  }

  if (!selectedProduct) {
    return (
      <p className="text-center p-5 text-gray-500">
        No product details available. 🔍
      </p>
    );
  }

  return (
    <div className="p-5">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnails (Desktop) */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.images?.length > 0 && (
              <img
                //key={imageObj.url}
                src={selectedProduct.images[0].url}
                alt={`${selectedProduct.name} thumbnail`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === selectedProduct.images[0].url
                    ? "border-black border-2"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(selectedProduct.images[0].url)}
                loading="lazy"
              />
            )}
          </div>

          {/* Main image */}
          <div className="md:w-1/2">
            <div className="mb-4">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={`main product - ${selectedProduct.name}`}
                  className="w-full h-[40rem] object-contain rounded-lg bg-gray-100"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-[40rem] flex items-center justify-center bg-gray-200 rounded-lg text-gray-500">
                  No Main Image Available
                </div>
              )}
            </div>
          </div>

          {/* Mobile thumbnail carousel */}
          <div className="md:hidden flex overflow-x-auto space-x-3 mb-4 p-2 border-t border-b border-gray-200">
            {selectedProduct.images?.map((imageObj, index) => (
              <img
                key={imageObj.url || index}
                src={imageObj.url}
                alt={`${selectedProduct.name} thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border flex-shrink-0 ${
                  mainImage === imageObj.url
                    ? "border-black border-2"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(imageObj.url)}
                loading="lazy"
              />
            ))}
          </div>

          {/* Right side - Product Info */}
          <div className="md:w-1/2 md:ml-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {selectedProduct.name}
            </h1>
            {selectedProduct.discountPrice &&
            selectedProduct.discountPrice < selectedProduct.price ? (
              <>
                <p className="text-xl text-gray-600 mb-1 line-through">
                  ₹{selectedProduct.price}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{selectedProduct.discountPrice}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-800">
                ₹{selectedProduct.price}
              </p>
            )}

            <p className="text-gray-700 mt-4 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Color Selection */}
            {Array.isArray(selectedProduct.color) &&
              selectedProduct.color.length > 0 && (
                <div className="mb-4 mt-6">
                  <p className="text-gray-800 font-semibold mb-2">Color:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.color.map((colorOption, index) => (
                      <button
                        key={colorOption || index}
                        onClick={() => setSelectColor(colorOption)}
                        className={`w-8 h-8 rounded-full border ${
                          selectColor === colorOption
                            ? "border-black border-4"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: colorOption.toLowerCase() }}
                        title={colorOption}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

            {/* Size Selection */}
            {Array.isArray(selectedProduct.size) &&
              selectedProduct.size.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-700 font-semibold mb-2">Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.size?.map((sizeOption, index) => (
                      <button
                        key={sizeOption || index}
                        onClick={() => setSelectSize(sizeOption)}
                        className={`px-4 py-2 rounded-md border text-sm ${
                          selectSize === sizeOption
                            ? "bg-black text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {sizeOption}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="mb-6 mt-6">
              <p className="text-gray-700 font-semibold mb-2">Quantity:</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-3 py-1 bg-gray-200 rounded-md text-xl font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-xl font-medium"> {quantity} </span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-3 py-1 bg-gray-200 rounded-md text-xl font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= selectedProduct.countInStock}
                >
                  +
                </button>
                {selectedProduct.countInStock < 10 &&
                  selectedProduct.countInStock > 0 && (
                    <span className="text-sm text-red-500 ml-4">
                      Only {selectedProduct.countInStock} left in stock!
                    </span>
                  )}
                {selectedProduct.countInStock === 0 && (
                  <span className="text-sm text-red-600 ml-4 font-semibold">
                    Out of Stock!
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className={`bg-black text-white py-3 px-8 rounded-md w-full text-lg font-semibold transition duration-300 ease-in-out ${
                isAddToCartDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-800"
              }`}
            >
              {isButtonDisable
                ? "Adding to Cart..."
                : selectedProduct.countInStock === 0
                  ? "OUT OF STOCK"
                  : "ADD TO CART"}
            </button>
          </div>
        </div>
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-6">
            You May also Like!
          </h2>
          <ProductGrid
            products={similarProducts}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
