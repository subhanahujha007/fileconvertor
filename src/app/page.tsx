"use client"
import React from 'react'
import Dropzone from './_Components/Dropzone'

const Home = () => {
  return (
    <div className='space-y-16 pb-8'>
        <div className='space-y-6'>
          <h1 className='text-3xl md:text-5xl font-medium text-center'>
              Free unlimited File convertor
          </h1>
          <p className='text-gray-400 text-md md:text-lg text-center md:px-24 xl:px-4 2xl:px-52'>
              Unleash your creativity with File convertor - The ultimate online tool for unlimited 
              and free <br /> mutlimedia conversion. Transform images,audio and videos effortlessly , without restriction . <br />
              Start converting now and elivate your content like never before   
          </p>
        </div>
        <Dropzone/>
    </div>
  )
}

export default Home