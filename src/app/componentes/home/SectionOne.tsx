import Image from 'next/image'
import React from 'react'
import { SlArrowDown } from "react-icons/sl";
//https://my-page-negiupp.s3.amazonaws.com/1746720934248.PNG
//https://my-page-negiupp.s3.amazonaws.com/1746720794048.PNG
const SectionOne = () => {
  return (
    <div className='flex flex-col gap-10 min-h-screen justify-center items-center relative'>

      <div className='relative w-full max-w-[600px] mx-auto aspect-[4/3] '>
        <Image
          src="https://my-page-negiupp.s3.amazonaws.com/1746720794048.PNG"
          alt="section_one"
          fill
          className='object-contain' // o usa object-cover si quieres que llene el contenedor
        />
      </div>
      <div className='flex flex-col gap-20 justify-center items-center'>
        {/* <h3 className='text-center text-[#363432] text-4xl md:text-2xl font-semibold'>Nuestra Boda</h3> */}

        <div className='flex justify-end items-center absolute bottom-10 left-1/2 transform -translate-x-1/2'>
          <SlArrowDown className='text-[#363432] font-light animate-bounce' size={30} />
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
