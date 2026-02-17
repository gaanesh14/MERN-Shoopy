import React from "react";
import { Link } from "react-router-dom";
import background from "../../assets/bgs/background3.jpg";

function Hero() {
  return (
    <section className="relative z-0">
      <img
        src={background}
        alt="shoppy"
        className="w-full h-[400px] md:h-[600px] lg:h-[800px] object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-end top-10">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-7xl my-3 text-white font-bold tracking-tighter uppercase mb-3">
            Start <br /> Shooping
          </h1>
          <p className="text-sm md:text-lg tracking-tighter mb-6 text-white">
            Explore your travelling outfits with fast fashion
          </p>
          <Link
            to="/collections/all"
            className=" bg-black text-white px-6 py-2 rounded-md text-lg"
          >
            shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
