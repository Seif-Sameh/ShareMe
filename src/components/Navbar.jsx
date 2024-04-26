import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {IoMdAdd, IoMdSearch} from 'react-icons/io'
const Navbar = ({user, search, setSearch}) => {
  const Navigate = useNavigate()

  if(!user) return null
  
  return (
    <div className='flex gap-2 items-center mb-10'>
      <div className='flex items-center w-full'>
      <IoMdSearch size={24} className='ml-2 absolute text-gray-400'/>
      <input 
      type="text" 
      className='w-full h-[50px] p-2 pl-9 outline-none rounded-md bg-white' 
      placeholder='Search' 
      onChange={(e) => setSearch(e.target.value)}
      value={search}
      onFocus={() => Navigate('/search', {replace: true})}
      />
      </div>
      <Link to={`/user-profile/${user?._id}`} className='hidden md:flex w-[50px] h-[50px]' >
        <img src={user?.image} alt="Profile" className='rounded-md' />
      </Link>
      <Link to={`/create-pin`} className='flex justify-center items-center w-[50px] h-[50px] bg-black text-white rounded-md cursor-pointer active:bg-gray-800'> 
        <IoMdAdd size={15}/>
      </Link>
    </div>
  )
}

export default Navbar