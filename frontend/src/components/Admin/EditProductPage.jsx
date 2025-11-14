import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// Import fetchProductById for single product fetching
import {
  fetchProductById,
  updateProduct,
} from "../../Redux/slices/adminProductSlice";
import axios from "axios";

function EditProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL params

  // Correct selector: access the `adminProducts` slice, then `selectedProduct`
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    size: [],
    collections: "",
    color: [],
    material: "",
    gender: "",
    images: [], // Expecting an array of image objects
  });

  const [uploading, setUploading] = useState(false);

  // Effect to fetch the specific product when the component mounts or ID changes
  useEffect(() => {
    if (id) {
      // Use the new fetchProductById thunk
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  // Effect to populate form data once selectedProduct is loaded
  useEffect(() => {
    if (selectedProduct) {
      // Ensure selectedProduct fields match productData state structure
      setProductData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || 0,
        countInStock: selectedProduct.countInStock || 0,
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        // Ensure array fields are handled correctly (provide default empty array)
        size: selectedProduct.size || [], // Assuming your backend returns 'size' not 'size' for array
        collections: selectedProduct.collections || "",
        color: selectedProduct.color || [], // Assuming your backend returns 'color' not 'color' for array
        material: selectedProduct.material || "",
        gender: selectedProduct.gender || "",
        images: selectedProduct.images || [], // This is crucial for pre-displaying images
        // Add other fields from your product model as needed for edit form
        discountPrice: selectedProduct.discountPrice || 0,
        isFeatured: selectedProduct.isFeatured || false,
        isPublished: selectedProduct.isPublished || false,
        tags: selectedProduct.tags || [],
        dimensions: selectedProduct.dimensions || "",
        weight: selectedProduct.weight || "",
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    setUploading(true);

    let token;
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo);
        token = parsed.token;
      } catch {
        token = null;
      }
    }
    if (!token) {
      token = localStorage.getItem("userToken");
    }
    if (!token) {
      throw new Error("Auth token missing");
    }

    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/upload/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProductData((prevData) => ({
      ...prevData,
      images: [...prevData.images, { url: data.imageUrl, altText: file.name }],
    }));

    setUploading(false);
  } catch (error) {
    console.error("Image upload failed:", error);
    setUploading(false);
  }
};



  // Optional: Function to remove an image from the list
  const handleRemoveImage = (indexToRemove) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch updateProduct with an object containing id and productData
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p>Loading product data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          ></textarea>
        </div>
        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Count in Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Brand */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Collections */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Collections</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Material */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Material</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* Gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <input
            type="text"
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* size */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            size (comma-separated)
          </label>
          <input
            type="text"
            name="size"
            value={productData.size?.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                size: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* color */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            color (comma-separated)
          </label>
          <input
            type="text"
            name="color"
            value={productData.color?.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                color: e.target.value.split(",").map((c) => c.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading image...</p>}
          <div className="flex flex-wrap gap-4 mt-4">
            {productData.images?.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={image.altText || "product Image"}
                  // {/* Use altText */}
                  className="w-30 h-20 object-cover rounded-md shadow-md"
                />
                {/* Add a remove button for images */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                  aria-label="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-color"
          disabled={uploading}
          // {/* Disable button while uploading */}
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default EditProductPage;
