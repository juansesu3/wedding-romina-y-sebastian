'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { PiChurchThin } from "react-icons/pi";
import { GiPartyPopper, GiTravelDress, GiWineGlass } from "react-icons/gi";
import { CiGift } from "react-icons/ci";
import { IoCameraOutline, IoImagesOutline } from "react-icons/io5";
import { MdOutlineLibraryMusic } from "react-icons/md";
import FadeInOnScroll from "../componentes/FadeScroll";
import { motion } from 'framer-motion';

export default function Home() {
  const [flipped, setFlipped] = useState(false);

  const imageVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 1, // delay escalonado
        duration: 3,
        ease: 'easeOut'
      }
    })
  };
  const images = [
    'https://my-page-negiupp.s3.amazonaws.com/1747830525049.jpeg',
    'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1747830445863.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1747830497567.jpeg',
    'https://my-page-negiupp.s3.amazonaws.com/1747830505363.jpeg',
    'https://my-page-negiupp.s3.amazonaws.com/1746726537861.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1747830435565.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1747830431708.JPG',
  ];

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-06-25T00:00:00');
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
    <main className="min-h-screen w-full text-[#363432] bg-[#faf6f3]">
      {/* Hero Section */}
      <FadeInOnScroll>
        <section className="flex flex-col gap-10 min-h-screen justify-center items-center relative">
          <div className="relative w-full max-w-[600px] mx-auto aspect-[4/3] flex justify-center items-center">
            <video
              src="/Invitacion-video.mp4"
              autoPlay
              muted
              playsInline
              loop={false} // React ignora este si no lo pones, por defecto no se repite
              onEnded={(e) => e.currentTarget.pause()} // aseguras que se detenga
              className="object-contain w-full h-full"
            />
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <SlArrowDown className="text-[#363432] animate-bounce" size={30} />
          </div>
        </section>
      </FadeInOnScroll>

      {/* Frase destacada */}
      <FadeInOnScroll>
        <section className="bg-[#d0b7a4] py-6 text-white text-center px-4">
          <p className="max-w-3xl mx-auto text-2xl font-light">
            A veces, dos almas se encuentran y descubren que juntas pueden construir un hogar que ningún plano podría imaginar...
          </p>
        </section>
      </FadeInOnScroll>

      {/* Fecha y contador */}
      <FadeInOnScroll>
        <section className="py-10 flex flex-col items-center gap-6">
          <p className="text-xl">Te esperamos el día</p>
          <h4 className="text-2xl font-extralight">25 de Junio de 2026</h4>
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
      </FadeInOnScroll>

      {/* Ceremonia y celebración */}
      <FadeInOnScroll>
        <section className="py-12 bg-[#faf6f3]">
          <div className="container mx-auto px-4 grid md:grid-cols-1 gap-12 text-center">
            {/* Ceremonia */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex  items-center gap-4">
                <PiChurchThin size={70} />
                <GiWineGlass size={50} />
              </div>

              <h4 className="text-2xl">Ceremonia & Celebración</h4>
              <p className="text-xl">Un momento íntimo y sincero que queremos compartir con ustedes..</p>
              <button className="btn-primary mt-4">Comó Llegar</button>
            </div>
            {/* Celebración */}
            {/* <div className="flex flex-col items-center gap-4">
              <GiWineGlass size={60} />
              <h4 className="text-2xl">Celebración</h4>
              <p className="text-xl">Queremos celebrar este gran paso rodeados de quienes más amamos.</p>
              <button className="btn-primary mt-4">Llegar a la celebración</button>
            </div> */}
          </div>
        </section>
      </FadeInOnScroll>

      {/* Nuestra historia - carrusel */}
      <FadeInOnScroll>
        <section className="py-16 text-center">
          <h2 className="text-3xl mb-8">Nuestra historia</h2>
          <div className="overflow-hidden w-full">
            <div className="flex w-max animate-scroll-left space-x-6">
              {images.concat(images).map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`Historia ${index}`}
                  width={500}
                  height={500}
                  className="h-48 sm:h-64 w-auto rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
         
        </section>
      </FadeInOnScroll>

      {/* Dresscode y regalo */}
      <FadeInOnScroll>
        <section className="py-16 text-center">
          <div className="flex justify-center items-center px-2">
      
            <div
              className={`relative w-full max-w-[400px]  transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
            >
              {/* Lado frontal */}
              <div className=" absolute inset-0  h-full w-full rounded-xl shadow-lg flex flex-col justify-center items-center gap-6 p-6 bg-white [backface-visibility:hidden]">
                <GiTravelDress size={80} className="text-[clamp(3rem,8vw,6rem)] mb-4 " />
                <div className="bg-[#cacaca] h-[2px] w-1/3 mb-8" />
                <p className="text-[clamp(1.25rem,3vw,1.75rem)] text-center">
                  Nuestra historia se viste de gala
                </p>
                <h5 className="text-[clamp(1.5rem,4vw,2rem)]">¡Y tú también!</h5>
                <button
                  onClick={() => setFlipped(true)}
                  className="mt-15 px-6 py-3 bg-black text-white rounded-lg hover:bg-[#333] transition text-[clamp(0.9rem,2.5vw,1.1rem)]"
                >
                  Descubrir dresscode
                </button>
              </div>

              {/* Lado trasero */}
              <div className=" w-full rounded-xl shadow-lg flex flex-col justify-start items-center p-6 bg-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
                
                <Image src={"/drescode-image.png"} alt="dresscode" className="h-52 w-52" width={500} height={500} />
                <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold mb-4">Formal</h3>
                <p className="text-center text-[clamp(1rem,2.5vw,1.2rem)]">
                  Queremos que te sientas especial y luzcas espectacular en nuestro día.
                </p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <p>Colores</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["#c1b4ac", "#cbb39d", "#ab8360", "#b47d60"].map((color, i) => (
                      <svg key={i} viewBox="0 0 100 100" className="w-10 h-10" style={{ fill: color }}>
                        <path d="M50 0c15 10 30 10 40 25s15 30 5 45-25 25-40 25-35-5-45-20S0 35 10 20 35-10 50 0z" />
                      </svg>
                    ))}
                  </div>
                  <p>Champagne</p>
                </div>
                <button
                  onClick={() => setFlipped(false)}
                  className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-[#333] transition text-[clamp(0.9rem,2.5vw,1.1rem)]"
                >
                  Volver
                </button>
              </div>
            </div>
            </div>
        </section>
      </FadeInOnScroll>

      {/* Galería de fotos */}

      <section className="py-12 bg-[#faf6f3]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center font-semibold mb-8">Galería</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={imageVariants}
              >
                <Image
                  src={src}
                  alt={`Imagen ${index + 1}`}
                  height={500}
                  width={500}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {[{
    icon: <GiPartyPopper size={60} />,
    title: "La fiesta está en marcha",
    text: "Será una ocasión para relajarnos y disfrutar juntos, en un ambiente para todos.",
    button: "Sugerir canción",
    link: "https://open.spotify.com/playlist/6kJUqsTHTe80nIPJ5VD6pw?si=MX8w0kfiT66jkdaW6vDsAw&pi=zCswFsG6T_iPa&pt=574511dc913c5245a161358b2b85013b"
  },
  {
    icon: <IoCameraOutline size={60} />,
    title: "Fotos inolvidables",
    text: "Queremos capturar cada sonrisa, cada abrazo, cada momento.",
    button: "Sube tus fotos"
  }
].map(({ icon, title, text, button, link }, idx) => (
  <FadeInOnScroll key={idx}>
    <section key={idx} className="py-12 bg-[#faf6f3] text-center px-4">
      <div className="flex flex-col items-center gap-4">
        {icon}
        <div className="bg-[#cacaca] h-[1px] w-1/3" />
        <h5 className="text-2xl">{title}</h5>
        <p className="text-xl">{text}</p>

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6"
          >
            {button}
          </a>
        ) : (
          <button className="btn-primary mt-6">{button}</button>
        )}
      </div>
    </section>
  </FadeInOnScroll>
))}

      <FadeInOnScroll>
        <section className="grid md:grid-cols-1">

          <div className="flex flex-col items-center justify-center bg-[#faf6f3] p-8 gap-4">
            <CiGift size={60} />
            <p className="text-xl text-center">Si deseas hacernos un regalo, además de tu hermosa presencia...</p>
            <button className="btn-primary mt-6">Ver datos bancarios</button>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="pt-12 bg-[#faf6f3]">
          <Image
            height={500}
            width={500}
            src={'https://my-page-negiupp.s3.amazonaws.com/1747832102521.jpeg'}
            alt={`Imagen `}
            className="w-full  object-cover  shadow-sm"
          />
          <p className="bg-[#d49e7a] text-white text-lg p-8 text-center">Gracias por ser parte de este capitulo tan importante de nuestras vidas </p>
        </section>
      </FadeInOnScroll>
    </main>
  );
}
