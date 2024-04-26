import React, { useState } from 'react'
import { client, urlFor } from '../client'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'


const Pin = ({ data: { destination, postedBy, _id, image, save } }) => {

    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()

    const [pinHover, setPinHover] = useState(false)
    const [savingPost, setSavingPost] = useState(false)
    const navigate = useNavigate()

    const alreadySaved = !!(save?.filter((item) => item.postedBy._id == userInfo?.sub)?.length)

    const savePin = (id) => {
        if (!alreadySaved) {
            setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: userInfo.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: userInfo.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    setSavingPost(false)
                })
        }

    }

    const deletePin = (id) => {
        client.delete(id)
            .then(() => {
                window.location.reload()
            })
    }

    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPinHover(true)}
                onMouseLeave={() => setPinHover(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img src={urlFor(image).width(250).url()} alt="user-post" className='rounded-lg w-full' />
                {pinHover && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-2 z-50' style={{ height: '100%' }}>
                        <div className='flex justify-between'>
                            <a
                                href={`${image?.asset?.url}?dl=`}
                                download
                                className='p-2 bg-white opacity-75 hover:opacity-100 rounded-full flex justify-center items-center cursor-pointer'
                                onClick={(e) => e.stopPropagation()}>
                                <MdDownloadForOffline size={25} />
                            </a>

                            {
                                alreadySaved ? (
                                    <button className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                        }}>

                                        {save?.length} Saved
                                    </button>
                                ) :
                                    (
                                        <button
                                            className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                savePin(_id)
                                            }}>
                                            Save
                                        </button>
                                    )
                            }

                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a
                                    href={destination}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='bg-white rounded-3xl truncate flex items-center gap-2 text-black font-bold p-2 opacity-70 hover:opacity-100 hover:shadow-md '
                                >
                                    <BsFillArrowUpRightCircleFill size={20} />
                                </a>
                            )}
                            {
                                postedBy?._id == userInfo?.sub && (
                                    <button
                                        type='button'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deletePin(_id)
                                        }}
                                        className='bg-white opacity-70 hover:opacity-100 text-black font-bold p-2 rounded-full hover:shadow-md outline-none'
                                    >
                                        <AiTwotoneDelete />
                                    </button>
                                )
                            }

                        </div>

                    </div>
                )}
            </div>
            <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                <img
                    className='w-8 h-8 rounded-full object-cover'
                    src={postedBy?.image}
                    alt='user-profile'
                />
                <p className='font-semibold capitalize'>{postedBy?.userName}</p>
            </Link>
        </div>
    )
}

export default Pin