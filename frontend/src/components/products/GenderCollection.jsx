import React from 'react'
import mens from '../../assets/assets/t-shirt1.webp'
import women from '../../assets/assets/w-jeans2.webp';
import { Link } from 'react-router-dom';

function GenderCollection   () {
  return (
     <section className='py-14 px-3 lg:px-0'>
        <div className='container mx-auto flex flex-col md:flex-row gap-10'>
            {/* {women collection} */}
            <div className='relative flex-1'>
                <img
                   src={women} 
                   alt='women collection'
                   className='w-full h-[600px] object-fill'
                   loading='lazy'
                />
                <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4 rounded-md'>
                    <h2 className='text-1xl font-bold text-gray-600 mb-3'>
                        Women's Collection
                    </h2>
                    <Link to='/collections/all?gender=Women' className='text-gray-900 underline'>
                     Shop Now
                    </Link>
                </div>
            </div>
             {/* {mens collection} */}
            <div className='relative flex-1'>
                <img
                   src={mens} 
                   alt='mens collection'
                   className='w-full h-[600px] object-cover'
                   loading='lazy'
                />
                <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4 rounded-md'>
                    <h2 className='text-xl font-bold text-gray-600 mb-3'>
                        men's Collection
                    </h2>
                    <Link to='/collections/all?gender=Men' className='text-gray-900 underline'>
                     Shop Now
                    </Link>
                </div>
            </div>
        </div>
    </section>
  )

}

export default GenderCollection   