import React, { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { client } from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/data'


const CreatePin = ({ user }) => {
    const [title, setTitle] = useState('')
    const [about, setAbout] = useState('')
    const [destination, setDestination] = useState('')
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState(false)
    const [category, setCategory] = useState(null)
    const [imageAsset, setImageAsset] = useState(null)
    const [wrongImageType, setWrongImageType] = useState(false)

    const navigate = useNavigate()

    const uploadImage = (e) => {
        const { type, name } = e.target.files[0]

        if (type === 'image/png' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff' || type === 'image/svg') {
            setWrongImageType(false)
            setLoading(true)

            client.assets
                .upload('image', e.target.files[0], { contentType: type, filename: name })
                .then((doc) => {
                    setImageAsset(doc)
                    setLoading(false)
                })
                .catch((err) => console.log('Image upload error', err))
        }
        else {
            setWrongImageType(true)
        }
    }

    const savePin = () => {
        console.log(category)
        if(title && about && destination && imageAsset?._id && category){
            const doc = {
                _type: 'pin',
                title,
                about, 
                destination,
                image: {
                    _type: 'image',
                    asset:{
                        _type: 'reference',
                        _ref: imageAsset?._id
                    }
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category,
            }

            client.create(doc)
            .then(() => {
                navigate('/')
            })
        }
        else{
            setFields(true)
            setTimeout(() => setFields(false), 2000)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center mt-5'>
            {fields &&
                <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                    Please fill in all the fields
                </p>
            }
            <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
                <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-420'>
                        {loading && <Spinner />}
                        {wrongImageType && <p>Wrong Image Type</p>}
                        {!imageAsset ?
                            <label >
                                <div className='flex flex-col items-center justify-center h-full p-4 text-center'>
                                    <div className='flex flex-col justify-center items-center cursor-pointer'>
                                        <AiOutlineCloudUpload size={30} />
                                        <p className='text-lg'>Click to upload</p>
                                    </div>
                                    <p className='mt-32 text-gray-400'>
                                        Use high-quality JPG, PNG, SVG, GIF ot TIFF less than 20 MBs
                                    </p>
                                </div>
                                <input type="file" name='upload-image' onChange={uploadImage} className='w-0 h-0' />
                            </label>
                            :
                            <div className='relative h-full'>
                                {imageAsset && <img src={imageAsset?.url} alt="uploaded-image" className='w-full h-full' />}
                                <button
                                    className='absolute bottom-2 right-2 bg-white opacity-70 hover:opacity-100 rounded-full p-1 hover:shadow-md transition-all duration-500 ease-in-out'
                                    onClick={() => setImageAsset(null)}
                                >
                                    <MdDelete size={25} />
                                </button>
                            </div>
                        }
                    </div>
                </div>
                <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Add your title here'
                        className='outline-none p-2 text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 '
                    />
                    {
                        user &&
                        <div className='flex gap-3 items-center'>
                            <img src={user?.image} alt="" className='rounded-full w-10' />
                            <p className='text-lg font-bold'>{user?.userName}</p>
                        </div>
                    }
                    <input
                        type='text'
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder='Tell us about your pin'
                        className='outline-none p-2 text-md sm:text-xl font-bold border-b-2 border-gray-200 '
                    />
                    <input
                        type='text'
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder='Add a destination link'
                        className='outline-none p-2 text-md sm:text-xl font-bold border-b-2 border-gray-200 '
                    />
                    <div>
                        <p className='text-lg font-bold mb-2'>Choose Pin Category</p>
                        <select 
                        className='outline-none capitalize w-full'
                        onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="other">Select Category</option>
                            {categories.map((cat) => (
                                <option
                                    className='bg-white border-none text-base'
                                    value={cat.name}
                                    key={cat.name}
                                >
                                    {cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex justify-end items mt-5'>
                        <button
                            className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
                            onClick={savePin}
                        >
                            Save Pin
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePin