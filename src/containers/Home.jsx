import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Feed from '../containers/Feed'
import {HiMenu} from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import { Link, Outlet} from 'react-router-dom'
import Logo from '../assets/logo.png'

const Home = ({user, searchTerm, setSearchTerm}) => {
  
  const [toggleMenu, setToggleMenu] = useState(false)
  
  return (
    <div className='flex md:flex-row flex-col h-full'>
      <div className='hidden md:flex w-[300px]'>
        <Sidebar/>
      </div>
      <div className='flex md:hidden w-full p-3 justify-between items-center'>
        <HiMenu size={40} className='cursor-pointer' onClick={()=>{
          setToggleMenu(true)
        }}/>
        <Link to={'/'}>
          <img src={Logo} alt="logo" className='w-[130px]' />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img src={user?.image} alt="logo" className='w-[40px] rounded-full' />
        </Link>
      </div>

      {
        toggleMenu && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute right-2 top-2 cursor-pointer' onClick={() => setToggleMenu(false)}>
              <AiFillCloseCircle size={20} />
            </div>
            <Sidebar user={user} closeSidebar={setToggleMenu}/>
          </div>
        )
      }
      <div className='w-full h-full bg-gray-200 p-3 min-h-screen'>
        <Navbar user={user} search={searchTerm} setSearch={setSearchTerm}/>
        <Outlet/>
      </div>
      
    </div>
  )
}

export default Home