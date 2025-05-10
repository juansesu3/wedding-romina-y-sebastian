import React from 'react'
import { GiTravelDress } from "react-icons/gi";
import { CiGift } from "react-icons/ci";
const SectionFive = () => {
  return (
    <div className='flex flex-col items-center mt-20 ' >

      <div className='flex flex-col items-center justify-center bg-[#fcfcfc] w-full p-8 gap-4'>
        <GiTravelDress size={60} />
        <div className='bg-[#cacaca] h-[1px] w-1/3' />
        <div className='flex flex-col items-center justify-center'>
          <p className='text-xl'>Nuestra historia se viste de gala!</p>
          <h5 className='text-2xl'>Y TU TAMBIEN</h5>
        </div>

      </div>
      <div className='flex flex-col items-center justify-center bg-[#fff5f5] w-full p-8'>
        <CiGift size={60} />
        <p className='text-xl text-center'>Si deseas hacernos un regalo, ademas de tu hemosa presencia...</p>
        <button className='capitalize bg-[#d49e7a] text-xl cursor-pointer hover:bg-[#87725a] text-white text-center  flex items-center justify-center  mt-10 py-2 px-14 rounded-md'>Ver datos bancarios</button>
      </div>
    </div>
  )
}

export default SectionFive