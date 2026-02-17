import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Filtersidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: [],
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });
  const [priceRange, setPriceRange] = useState([0, 100]);

  const category = ["Top Wear", "Bottom Wear"];

  const color = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "Yellow",
    "Gray",
    "Pink",
    "White",
    "Beige",
  ];

  const size = ["XS", "S", "M", "L", "XL", "XXL"];
  const Brands = ["Levis", "Wrogn", "fc", "H & M", "Gap", "snitch", "Dnmx"];
  const materials = ["cotton", "wool", "silk", "Denim", "lenin", "Polyster"];
  const gender = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color ? params.color.split(",") : [],
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  // This handler is for radio buttons and checkboxes
  const handleInputFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "radio") {
      newFilters[name] = value;
    } else {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // This handler is specifically for the color buttons
  const handleColorChange = (colorValue) => {
    let newFilters = { ...filters };
    //console.log(newFilters);
    const currentColors = Array.isArray(newFilters.color)
      ? newFilters.color
      : [];
    if (currentColors.includes(colorValue)) {
      newFilters.color = currentColors.filter((c) => c !== colorValue);
      //console.log(newFilters);
    } else {
      newFilters.color = [...currentColors, colorValue];
      //console.log("result:",newFilters);
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setPriceRange([0, newPrice]);
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-2">
      <label className="text-xl font-medium text-gray-800 mb-5"> Filter </label>
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-3">Category</label>
        {category.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleInputFilterChange}
              checked={filters.category === category}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700 text-sm"> {category}</span>
          </div>
        ))}
      </div>
      {/* Gender Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2"> Gender </label>
        {gender.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleInputFilterChange}
              checked={filters.gender === gender}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700 text-sm"> {gender}</span>
          </div>
        ))}
      </div>
      {/* Color filters */}
      <div className="mb-6">
        <label className="bloc text-gray-700 font-medium mb-2 "> Color </label>
        <div className="flex flex-wrap gap-2">
          {color?.map((c) => (
            <button
              key={c}
              // Correctly call the new handler with the color value
              onClick={() => handleColorChange(c)}
              className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${
                filters.color.includes(c) ? "ring-2 ring-blue-500" : ""
              }`}
              style={{ backgroundColor: c }}
            ></button>
          ))}
        </div>
      </div>
      {/* Size filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2"> Size </label>
        {size.map((s) => (
          <div key={s} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={s}
              onChange={handleInputFilterChange}
              checked={filters.size?.includes(s)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700"> {s}</span>
          </div>
        ))}
      </div>
      {/* Brand filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2"> Brand </label>
        {Brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleInputFilterChange}
              checked={filters.brand.includes(brand)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700"> {brand}</span>
          </div>
        ))}
      </div>
      {/* material filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleInputFilterChange}
              checked={filters.material.includes(material)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700"> {material}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-600 mt-2">
          <span> $ 0 </span>
          <span> $ {priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}

export default Filtersidebar;
