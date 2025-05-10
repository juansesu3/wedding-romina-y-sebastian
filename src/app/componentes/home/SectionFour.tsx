import React from 'react'

const SectionFour = () => {
    const images = [
        'https://my-page-negiupp.s3.amazonaws.com/1746726537861.JPG',
        'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
        'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
        'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
        'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
        // Añade más rutas si es necesario
    ]
    return (
        <div className='flex flex-col items-center mt-20' >
            <h1 className='text-3xl mb-8'>Nuestra historia</h1>

            <div className='overflow-hidden w-full'>
                <div className='flex w-max animate-scroll-left space-x-6'>
                    {images.concat(images).map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Historia ${index}`}
                            className='h-64 w-auto rounded-lg shadow-md'
                        />
                    ))}
                </div>
          
            </div>
            <button className='capitalize bg-[#d49e7a] text-xl cursor-pointer hover:bg-[#87725a] text-white text-center  flex items-center justify-center  mt-10 py-2 px-14 rounded-md'>Ver Fotos</button>
        </div>
    )
}

export default SectionFour