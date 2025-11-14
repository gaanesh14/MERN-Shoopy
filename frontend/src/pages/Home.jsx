import Hero from "../components/Layout/Hero";
import GenderCollection from "../components/products/GenderCollection";
import NewArrivals from "../components/products/NewArrivals";
import ProductDetails from "../components/products/ProductDetails";
import ProductGrid from "../components/products/ProductGrid";

import FeaturedCollections from "../components/products/FeaturedCollections";
import FeatersSection from "../components/products/FeatersSection";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProductsByFilters } from "../Redux/slices/productSlice";
import axios from "axios";


function Home() {
     const dispatch = useDispatch();
     const {products, loading, error} = useSelector((state) => state.products)
     const [bestSellerProduct, setBestSellerProduct] = useState(null);

     useEffect(() => {
       // Fetch Products from a specific collection.
      dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category:"Bottom Wear",
        limit : 8,
      })
    );
    // fetch best seller product
       const fetchBestSeller = async() => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
          setBestSellerProduct(response.data);
        } catch (error) {
           console.error(error)
        }
       }
       fetchBestSeller()
     },[dispatch]);
  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* {Best Seller} */}
      <h2 className='text-3xl text-center font-bold mb-4'> Best Seller </h2>
            {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />) : (
                <p className='text-center'> Loading best seller product...</p>
            )}

      <div className="container mx-auto ">
        <h2 className="text-3xl text-center font-bold mb-4">
          {" "}
          Women Collections
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollections />
      <FeatersSection />
    </div>
  );
}

export default Home;
