import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { useParams } from 'react-router-dom'
import { searchQuery, feedQuery } from '../utils/data'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'

const Feed = () => {
  const [loading, setLoading] = useState(true)
  const [pins, setPins] = useState(null)

  const {category} = useParams()

  useEffect(() => {
    if(category){
      const query = searchQuery(category)
      client.fetch(query)
      .then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
    else{
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [category])

  return (
    <div className='p-5'>
      {loading && <Spinner message={'We are adding new ideas to your feed!'}/>}
      {pins && <MasonryLayout pins={pins}/>}
      {pins?.length == 0 && <div className='flex flex-col w-full h-full items-center justify-center text-center text-xl text-gray-600 font-bold'> <p>No Pins found here </p> <p>You can add some!</p></div>}
    </div>
  )
}

export default Feed