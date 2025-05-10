'use client';
import React, { useEffect, useState } from 'react';

const SectionTwo = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Fecha objetivo: 16 de diciembre de 2026 a las 00:00 (hora local)
    const targetDate = new Date('2026-08-16T00:00:00');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return (
        <div className=' flex flex-col justify-center items-center gap-6 '>
            <div className='bg-[#d0b7a4] text-white text-center py-4 flex items-center justify-center w-full'>
                <p className='w-2/3 text-[#fff] text-2xl font-light'>
                    A veces, dos almas se encuentran y descubren que juntas pueden construir un hogar que ningún plano podría imaginar...
                </p>
            </div>

            <div className='flex flex-col  items-center justify-center'>
                <div className='flex flex-col gap-4 items-center justify-center'>


                    <p className='text-xl font-normal'>Te esperamos el día</p>
                    <h4 className='text-2xl font-extralight  mb-4'>22 de Agosto de 2026</h4>
                </div>
                <div className='flex justify-center gap-6 text-lg'>
                    <div className='flex flex-col items-center'>
                        <strong>{timeLeft.days}</strong>
                        <p>Días</p>
                    </div>
                    <div className='flex flex-col items-center'><strong>{timeLeft.hours}</strong>  <p>Hs</p></div>
                    <div className='flex flex-col items-center'><strong>{timeLeft.minutes}</strong> <p>Min</p></div>
                    <div className='flex flex-col items-center'><strong>{timeLeft.seconds}</strong> <p>Seg</p></div>
                </div>
                <button className='bg-[#d49e7a] text-xl cursor-pointer hover:bg-[#87725a] text-white text-center  flex items-center justify-center  mt-10 py-2 px-14 rounded-md'>
                    Agendar Fecha
                </button>
            </div>
        </div>
    );
};

export default SectionTwo;
