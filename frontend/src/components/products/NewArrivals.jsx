import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

function NewArrivals() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
       // console.log("new arrivals:", response.data);
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setNewArrivals([]);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const updateScrollButton = () => {
    const container = scrollRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth
    );
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButton);
      updateScrollButton();
    }
    return () => container?.removeEventListener("scroll", updateScrollButton);
  }, [newArrivals]);

  return (
    <section className="py-12 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-20 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-700 mb-4">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on point.
        </p>
        <div className="absolute right-0 bottom-[-50px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft
                ? "bg-gray-200 text-black"
                : "bg-white text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-gray-200 text-black"
                : "bg-white text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {Array.isArray(newArrivals) && newArrivals.length > 0 ? (
          newArrivals.map((product) => (
            <div
              key={product._id}
              className="min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] relative"
            >
              <img
                src={product.images?.[0]?.url || "/placeholder.jpg"}
                alt={product.images?.[0]?.altText || product.name}
                className="w-full h-[400px] object-cover rounded-lg"
                draggable="false"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 backdrop-blur-md text-white p-2 rounded-b-lg">
                <Link to={`/products/${product._id}`} className="block">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="mt-1 font-semibold">${product.price}</p>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">
            No new arrivals found.
          </p>
        )}
      </div>
    </section>
  );
}

export default NewArrivals;
