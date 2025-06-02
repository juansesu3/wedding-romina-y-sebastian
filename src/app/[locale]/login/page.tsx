'use client'
import FadeInOnScroll from '@/app/componentes/FadeScroll'
import React from 'react'

const page = () => {
    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/assets/fondo-boda-3.webp')` }}>
            <div className="absolute inset-0 bg-black/40" /> {/* Capa oscura opcional para legibilidad */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <FadeInOnScroll>
                    <form className="bg-[#d0b7a487] bg-opacity-10 p-6 rounded shadow-lg max-w-md w-full flex   flex-col justify-center items-center gap-3">
                        <h3 className='text-white text-4xl text-center font-extrabold '>¡Nos encantaria que seas parte de este dia tan especial! </h3>
                        <p className='font-bold text-2xl'>Ingresa tu codigo para continuar</p>
                        <input type="text" className='border-none rounded-md p-2 bg-white' />
                        <button className='btn-primary'>
                            ver invitacion
                        </button>
                        {/* Campos del formulario */}
                    </form>
                </FadeInOnScroll>
            </div>
        </div>

    )
}

export default page