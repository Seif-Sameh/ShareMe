import React from 'react'
import backgroundVideo from '../assets/share.mp4'
import LogoWhite from '../assets/logowhite.png'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { client } from '../client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()

    const onSuccess = (response) => {
        const data = jwtDecode(response.credential)
        const {name, picture,  jti} = data
        localStorage.setItem('user', JSON.stringify(data))
        
        const doc = {
            _id: jti,
            _type: 'user',
            userName: name,
            image: picture,
        }
        client.createIfNotExists(doc)
        .then(() => {
            navigate('/', {replace: true})
        })
    }
    
    return (
        <div className='relative'>
            <video
                src={backgroundVideo}
                type='video/mp4'
                loop
                autoPlay
                muted
                controls={false}
                className='w-full h-[100vh] object-cover'
            />
            <div className='absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
                <div className='p-5'>
                    <img src={LogoWhite} alt="" />
                </div>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        onSuccess(credentialResponse)
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />

            </div>
        </div>
    )
}

export default Login