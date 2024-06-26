import React from 'react'
import {Circles} from 'react-loader-spinner'

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <Circles
            color='#00BFFF'
            width={200}
            height={50}
            className="m-5"
        />
        <p className='text-lg text-center my-3'>{message}</p>
    </div>
  )
}

export default Spinner