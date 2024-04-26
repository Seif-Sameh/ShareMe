import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { client, urlFor } from '../client'
import MasonryLayout from '../containers/MasonryLayout'
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({ user }) => {
    const [pins, setPins] = useState(null)
    const [pinDetail, setPinDetail] = useState(null)
    const [comment, setComment] = useState('')
    const [addingcomment, setAddingComment] = useState('')
    const { pinId } = useParams()


   const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId)

        if (query) {
            client.fetch(query)
                .then((data) => {
                    setPinDetail(data[0])

                    if (data[0]) {
                        query = pinDetailMorePinQuery(data[0])

                        client.fetch(query)
                            .then((res) => {
                                setPins(res)
                            })
                    }
                })
        }
    }

    const addComment = () => {
        if(comment){
            setAddingComment(true)
            client.patch(pinId)
            .setIfMissing({comments : []})
            .insert('after', 'comments[-1]', [{
                comment, 
                _key: uuidv4(),
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id
                }
            }])
            .commit()
            .then(() => {
                console.log('done');
                fetchPinDetails()
                setComment('')
                setAddingComment(false)
            })
        }
    }

    useEffect(() => {
        fetchPinDetails();
    }, [pinId])

    return (
        <>
            {!pinDetail && <Spinner message={'Loading Pin ...'} />}
            <div className='flex xl:flex-row flex-col m-auto p-4 bg-white mb-7' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
                <div className='flex justify-center items-center md:items-start flex-initial'>
                    <img
                        src={pinDetail?.image && urlFor(pinDetail.image).url()}
                        alt="user-post"
                        className='rounded-t-3xl rounded-b-lg' />
                </div>
                <div className='w-full p-5 flex-1 xl-min-w-620 '>
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-2 items-center'>
                            <a
                                href={`${pinDetail?.image?.asset?.url}?dl=`}
                                download
                                className='p-2 bg-white opacity-75 hover:opacity-100 rounded-full flex justify-center items-center cursor-pointer'
                                onClick={(e) => e.stopPropagation()}>
                                <MdDownloadForOffline size={25} />
                            </a>
                        </div>
                        <a href={pinDetail?.destinaion} target='blank' rel='noreferrer'>
                            {pinDetail?.destination}
                        </a>
                    </div>
                    <div>
                        <h1 className='text-4xl font-bold break-words mt-3'>
                            {pinDetail?.title}
                        </h1>
                        <p className='mt-3'>{pinDetail?.about}</p>
                    </div>
                    <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
                        <img
                            className='w-8 h-8 rounded-full object-cover'
                            src={pinDetail?.postedBy?.image}
                            alt='user-profile'
                        />
                        <p className='font-semibold capitalize'>{pinDetail?.postedBy?.userName}</p>
                    </Link>
                    <h2 className='mt-5 text-lg text-gray-500'>Comments</h2>
                    <div className='max-h-370 overyflow-y-auto'>
                        {pinDetail?.comments?.map((comment, index) => (
                            <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={index}>
                                <img src={comment?.postedBy?.image}
                                    className='w-10 h-10 rounded-full cursor-pointer' />
                                <div className='flex flex-col'>
                                    <p className='font-bold'>{comment?.postedBy?.userName}</p>
                                    <p>{comment?.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-wrap mt-6 gap-3'>
                        <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
                            <img
                                className='w-10 h-10 rounded-full cursor-pointer'
                                src={pinDetail?.postedBy?.image}
                                alt='user-profile'
                            />
                        </Link>
                        <input type="text" 
                        className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300' 
                        placeholder='Add a comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        /> 
                        <button
                        type='button'
                        className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                        onClick={addComment}
                        >
                            {addingcomment? 'Posting the comment' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
            {pins?.length > 0? (
                <>
                <h2 className='text-center font-bold text-2xl mt-8 mb-4'>More like this</h2>
                <MasonryLayout pins={pins}/>
                </>
            ):
            <Spinner message={'Loading more pins...'}/>}
        </>
    )
}

export default PinDetail