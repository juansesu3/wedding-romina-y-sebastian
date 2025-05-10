'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { PiChurchThin } from "react-icons/pi";
import { GiPartyPopper, GiTravelDress, GiWineGlass } from "react-icons/gi";
import { CiGift } from "react-icons/ci";
import { IoCameraOutline, IoImagesOutline } from "react-icons/io5";
import { MdOutlineLibraryMusic } from "react-icons/md";

export default function Home() {
  const images = [
    'https://my-page-negiupp.s3.amazonaws.com/1746726537861.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1746726537861.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
  ];

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-08-16T00:00:00');
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
    <main className="min-h-screen w-full text-[#363432]">
      {/* Hero Section */}
      <section className="flex flex-col gap-10 min-h-screen justify-center items-center relative">
        <div className="relative w-full max-w-[600px] mx-auto aspect-[4/3]">
          <Image
            src="https://my-page-negiupp.s3.amazonaws.com/1746720794048.PNG"
            alt="Hero"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <SlArrowDown className="text-[#363432] animate-bounce" size={30} />
        </div>
      </section>

      {/* Frase destacada */}
      <section className="bg-[#d0b7a4] py-6 text-white text-center px-4">
        <p className="max-w-3xl mx-auto text-2xl font-light">
          A veces, dos almas se encuentran y descubren que juntas pueden construir un hogar que ningún plano podría imaginar...
        </p>
      </section>

      {/* Fecha y contador */}
      <section className="py-10 flex flex-col items-center gap-6">
        <p className="text-xl">Te esperamos el día</p>
        <h4 className="text-2xl font-extralight">22 de Agosto de 2026</h4>
        <div className="flex justify-center gap-6 text-lg">
          {["Días", "Hs", "Min", "Seg"].map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <strong>{Object.values(timeLeft)[i]}</strong>
              <p>{label}</p>
            </div>
          ))}
        </div>
        <button className="btn-primary mt-6">Agendar Fecha</button>
      </section>

      {/* Ceremonia y celebración */}
      <section className="py-12 bg-[#fcfcfc]">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 text-center">
          {/* Ceremonia */}
          <div className="flex flex-col items-center gap-4">
            <PiChurchThin size={60} />
            <h4 className="text-2xl">Ceremonia</h4>
            <p className="text-xl">Lorem ipsum dolor sit amet.</p>
            <button className="btn-primary mt-4">Llegar a la ceremonia</button>
          </div>
          {/* Celebración */}
          <div className="flex flex-col items-center gap-4">
            <GiWineGlass size={60} />
            <h4 className="text-2xl">Celebración</h4>
            <p className="text-xl">Lorem ipsum dolor sit amet.</p>
            <button className="btn-primary mt-4">Llegar a la celebración</button>
          </div>
        </div>
      </section>

      {/* Nuestra historia - carrusel */}
      <section className="py-16 text-center ">
        <h2 className="text-3xl mb-8">Nuestra historia</h2>
        <div className="overflow-hidden w-full">
          <div className="flex w-max animate-scroll-left space-x-6">
            {images.concat(images).map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Historia ${index}`}
                className="h-64 w-auto rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
        <button className="btn-primary mt-10 mx-auto">Ver Fotos</button>
      </section>

      {/* Dresscode y regalo */}
      <section className="grid md:grid-cols-2">
        <div className="flex flex-col items-center justify-center bg-[#fcfcfc] p-8 gap-4">
          <GiTravelDress size={60} />
          <div className="bg-[#cacaca] h-[1px] w-1/3" />
          <p className="text-xl">Nuestra historia se viste de gala!</p>
          <h5 className="text-2xl">¡Y tú también!</h5>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#fff5f5] p-8 gap-4">
          <CiGift size={60} />
          <p className="text-xl text-center">Si deseas hacernos un regalo, además de tu hermosa presencia...</p>
          <button className="btn-primary mt-6">Ver datos bancarios</button>
        </div>
      </section>

      {/* Galería de fotos */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center font-semibold mb-8">Galería</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Imagen ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fiesta, Instagram, Música, Fotos */}
      {[{
        icon: <GiPartyPopper size={60} />,
        title: "La fiesta está en marcha",
        text: "Será una ocasión para relajarnos y disfrutar juntos, en un ambiente para todos.",
        button: "Sugerir canción"
      }, {
        icon: <IoImagesOutline size={60} />,
        title: "¡Si hay foto, hay historia!",
        text: "Síguenos en nuestra cuenta de Instagram y etiquétanos en tus fotos y videos.",
        subtext: "@TUUSUARIO",
        button: "Ver Instagram"
      }, {
        icon: <MdOutlineLibraryMusic size={60} />,
        title: "¡Que suene la música!",
        text: "Ayúdanos a elegir el soundtrack de la noche.",
        button: "Sugerir canción"
      }, {
        icon: <IoCameraOutline size={60} />,
        title: "Fotos inolvidables",
        text: "Queremos capturar cada sonrisa, cada abrazo, cada momento.",
        button: "Sube tus fotos"
      }].map(({ icon, title, text, subtext, button }, idx) => (
        <section key={idx} className="py-12 bg-[#fcfcfc] text-center px-4">
          <div className="flex flex-col items-center gap-4">
            {icon}
            <div className="bg-[#cacaca] h-[1px] w-1/3" />
            <h5 className="text-2xl">{title}</h5>
            <p className="text-xl">{text}</p>
            {subtext && <p className="text-xl">{subtext}</p>}
            <button className="btn-primary mt-6">{button}</button>
          </div>
        </section>
      ))}
    </main>
  );
}
