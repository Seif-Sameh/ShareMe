import React from 'react'
import Logo from '../assets/logo.png'
import {RiHomeFill} from 'react-icons/ri'
import { Link, NavLink} from 'react-router-dom'
import { categories } from '../utils/data'


const Sidebar = ({user, closeSidebar}) => {


    const isActiveStyle = 'flex items-center px-5 gap-3 border-r-2 border-black font-extrabold text-black transition-all duration-200 ease-in-out capitalize'
    const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'

  return (
    <div className='flex flex-col py-4 gap-6 w-full h-screen overflow-y-scroll hide-scrollbar'>
        <div className='pl-4' >
            <img src={Logo} alt="" className='w-[170px]'/>
        </div>
        <NavLink to={'/'} 
        className={({isActive}) => (isActive? isActiveStyle: isNotActiveStyle)}
        onClick={() => (closeSidebar && closeSidebar(false))}
        >
                <RiHomeFill  size={20}/> 
                <span>Home</span>
        </NavLink>
        <div className='flex flex-col pl-2 gap-3'>
            <span className='pl-2 mb-3'>Discover categories</span>
            <div className='flex flex-col gap-5 text-gray-500'>
                {categories.map((item) => (
                    <NavLink 
                    to={`/category/${item.name.toLowerCase()}`} 
                    key={item.name} 
                    className={({isActive}) => (isActive? isActiveStyle: isNotActiveStyle)}
                    onClick={() => (closeSidebar && closeSidebar(false))}
                    >
                        <img src={item.image} alt="" className='w-8 h-8 rounded-full shadow-sm'/>
                        {item.name}
                    </NavLink>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Sidebar