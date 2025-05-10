import React from 'react'
import { GiPartyPopper } from "react-icons/gi";
import { IoImagesOutline } from "react-icons/io5";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
const SectionSeven = () => {
  return (
    <div className='min-h-screen'>
      <div className='flex flex-col items-center justify-center bg-[#fcfcfc] w-full p-8 gap-4'>
        <GiPartyPopper size={60} />
        <div className='bg-[#cacaca] h-[1px] w-1/3' />
        <div className='flex flex-col items-center justify-center'>
          <p className='text-xl  text-center'>La Fiesta esa en marcha</p>
          <h5 className='text-2xl text-center'>Sera una ocasion para relajarnos y disfrutar juntos, en un ambiente para todos.</h5>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center bg-[#fcfcfc] w-full p-8 gap-4'>
        <IoImagesOutline size={60} />
        <div className='bg-[#cacaca] h-[1px] w-1/3' />
        <div className='flex flex-col items-center justify-center'>
          <p className='text-xl  text-center'>Si hay foto, hay hostoria!</p>
          <p className='text-xl  text-center'>@TUUSARIO</p>
          <h5 className='text-2xl  text-center'>Seguinos en nuestra cuenta de instagram y etiquetanos en tus fotos y videos!</h5>
        </div>
        <button className='capitalize bg-[#d49e7a] text-xl cursor-pointer hover:bg-[#87725a] text-white text-center  flex items-center justify-center  mt-10 py-2 px-14 rounded-md'>Ver Instagram</button>
      </div>
      <div className='flex flex-col items-center justify-center bg-[#fcfcfc] w-full p-8 gap-4'>
        <MdOutlineLibraryMusic size={60} />
        <div className='bg-[#cacaca] h-[1px] w-1/3' />
        <div className='flex flex-col items-center justify-center'>
          <p className='text-xl  text-center'>La Fiesta esa en marcha</p>
          <h5 className='text-2xl text-center'>Sera una ocasion para relajarnos y disfrutar juntos, en un ambiente para todos.</h5>
        </div>
        <button className='capitalize bg-[#d49e7a] text-xl cursor-pointer hover:bg-[#87725a] text-white text-center  flex items-center justify-center  mt-10 py-2 px-14 rounded-md'>Sugerir cancion</button>
      </div>
      <div className='flex flex-col items-center justify-center bg-[#fcfcfc] w-full p-8 gap-4'>
        <IoCameraOutline size={60} />
        <div className='bg-[#cacaca] h-[1px] w-1/3' />
        <div className='flex flex-col items-center justify-center'>
          <p className='text-xl  text-center'>La Fiesta esa en marcha</p>
          <h5 className='text-2xl text-center'>Sera una ocasion para relajarnos y disfrutar juntos, en un ambiente para todos.</h5>
        </div>
        <button className='capitalize bg-[#d49e7a] text-xl cursor-pointer hover:bg-[#87725a] text-white text-center  flex items-center justify-center  mt-10 py-2 px-14 rounded-md'>Sugerir cancion</button>
      </div>
    </div>
  )
}

export default SectionSeven