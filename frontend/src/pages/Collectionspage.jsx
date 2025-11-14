import React, { useEffect, useState,useRef } from 'react'
import { FaFilter } from "react-icons/fa";
import Filtersidebar from '../components/products/Filtersidebar';
import ProductGrid from '../components/products/ProductGrid';
import SortOptions from '../components/products/SortOptions';
import { useParams, useSearchParams,useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters, setFilters } from '../Redux/slices/productSlice';


function Collectionspage() {
  const location = useLocation();
  const {collection} = useParams();
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch();
  const { products, loading, error, filters: currentFilters } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);
  
 // const [products, setProducts] = useState([])
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const sidebarRef = useRef(null) 

  useEffect(() => {
    dispatch(fetchProductsByFilters({collections: collection, ...queryParams}));
  },[dispatch,collection,searchParams])
  
  const toogleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen)
  }
  
  const handleClickOutside = (e) => {
      if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
        setIsSideBarOpen(false)
        
      }
  };
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    const payload = { collections: collection, ...params };
    const handle = setTimeout(() => {
      dispatch(setFilters(payload)); // keep redux in sync
      dispatch(fetchProductsByFilters(payload));
    },500);
     
      return clearTimeout(handle)
  }, [dispatch, collection, searchParams.toString()]);

  useEffect(() => {
    // add eventlistner for clicks
    document.addEventListener("mousedown",handleClickOutside)
    // remove eventlistnet for clicks
    return() => {
      document.removeEventListener("mousedown",handleClickOutside)
    }
    
  },[]);


  if(loading){
    return <p> Loading.....</p>
  }
  if(error) return <p> Error : {error}</p>

  return (
    <div className='flex flex-col lg:flex-row'>
      <button onClick={toogleSideBar}className='lg:hidden  border p-2 flex justify-center items-center'>
         <FaFilter className='mr-2'/>
      </button>
      <div ref={sidebarRef}
           className={`${isSideBarOpen ? 'translate-x-0' : "-translate-x-full"} 
           fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <Filtersidebar/>
      </div>
      <div className='text-grow p-4'>
        <h2 className='text-2xl uppercase mb-4'> All Collections </h2>
        {/* {sort options} */}
          <SortOptions/>
        
        {/* {Product grid} */}
        <ProductGrid products={products} />
      </div>
    </div>
  )
}

export default Collectionspage