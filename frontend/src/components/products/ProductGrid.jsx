import React from "react";
import { Link } from "react-router-dom";

function ProductGrid({ products, loading, error }) {
  if (loading) {
    return <p className="text-center p-4">Loading similar products....</p>;
  }
  if (error) {
    return <p className="text-center p-4 text-red-500">Error: {error}</p>;
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center p-4 text-gray-500">
        No similar products to display.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {" "}
      {/* Increased gap */}
      {products.map((product, index) => (
        <Link
          key={product._id || index}
          to={`/product/${product._id}`}
          className="block group" // Added group for hover effects
          onClick={() => window.scrollTo(0, 0)} // Scroll to top on product click
        >
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            {" "}
            {/* Added shadow and hover effect */}
            <div className="w-full h-80 mb-4 overflow-hidden rounded-lg">
              {" "}
              {/* Fixed height for image container */}
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300" // Added scale on hover
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <h3 className="text-sm font-semibold mb-2 text-gray-800 line-clamp-2 text-nowrap">
              {" "}
              {/* Added line-clamp-2 for name */}
              {product.name}
            </h3>
            {product.discountPrice && product.discountPrice < product.price ? (
              <div className="flex items-baseline space-x-2">
                <p className="text-gray-500 line-through text-sm">
                  ${product.price}
                </p>
                <p className="text-red-600 font-bold text-lg">
                  ${product.discountPrice}
                </p>
              </div>
            ) : (
              <p className="text-gray-800 font-bold text-lg">
                ${product.price}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductGrid;
