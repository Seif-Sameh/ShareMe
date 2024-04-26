import React from 'react'
import Masonry from 'react-masonry-css'
import Pin from '../components/Pin'

const MasonryLayout = ({pins}) => {
    const breakpointObj = {
        default: 4,
        3000: 6,
        2000: 5,
        1200: 3,
        1000: 2,
        500:1,
    }
  return (
    <Masonry
    breakpointCols={breakpointObj}
    className='flex animate-slide-fwd'
    >
    {pins && pins.map((pin) => (<Pin key={pin._id} data={pin}/>))}
    </Masonry>

  )
}

export default MasonryLayout