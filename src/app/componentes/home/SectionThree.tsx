import React from 'react'
import { PiChurchThin } from "react-icons/pi";
import { GiWineGlass } from "react-icons/gi";

const SectionThree = () => {
    return (
        <div className='bg-[#fcfcfc]  flex flex-col items-center py-8'>
            <div className='flex flex-col gap-12 items-center justify-center'>

      
            <div className='flex flex-col gap-2 items-center justify-center'>
                <PiChurchThin size={60} />
                <h4 className='text-2xl'>Ceremonia</h4>
                <p className='text-xl'>Lorem ipsum dolor sit amet.</p>
                <button className='capitalize  bg-[#d49e7a] text-xl cursor-pointer hover:bg-[#87725a] text-white text-center  flex items-center justify-center  mt-10 py-2 px-14 rounded-md'>Llegar a la ceremonia</button>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center'>
                <GiWineGlass size={60} />
                <h4 className='text-2xl'>Celebración</h4>
                <p className='text-xl'>Lorem ipsum dolor sit amet.</p>
                <button className='capitalize bg-[#d49e7a] text-xl cursor-pointer hover:bg-[#87725a] text-white text-center  flex items-center justify-center  mt-10 py-2 px-14 rounded-md'>Llegar a la celebracion</button>
            </div>
            </div>
        </div>
    )
}

export default SectionThree