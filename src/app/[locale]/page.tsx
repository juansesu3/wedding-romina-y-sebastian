// src/app/[locale]/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SlArrowDown } from 'react-icons/sl';
import { PiChurchThin } from 'react-icons/pi';
import { GiWineGlass } from 'react-icons/gi';
import FadeInOnScroll from '../componentes/FadeScroll';
import InviteForm from '../componentes/InviteForm';
import HowToArriveModal from '../componentes/HowToArriveModal';

export default function Home() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale as string) || 'es';

  const [isHowToOpen, setIsHowToOpen] = useState(false);

  // Ejemplo: Finca Atlántida (ajusta dirección/coords reales)
  const venueName = 'Finca Atlántida (Sens Restauración)';
  const address = 'Lugar Atlántida s/n, 15800, Galicia, España'; // <- cambia por tu dirección exacta
  const destLat = 42.460423; // ej. 42.88
  const destLng = -8.890235; // ej. -8.54

  const nearCities = [
    { name: 'Santiago de Compostela', note: 'Centro histórico', mapsQuery: 'Santiago de Compostela' },
    { name: 'A Coruña', note: 'Costa y centro', mapsQuery: 'A Coruña' },
    { name: 'Vigo', note: 'Zona Rías Baixas', mapsQuery: 'Vigo' },
    { name: 'Pontevedra', note: 'Ciudad histórica y capital provincial', mapsQuery: 'Pontevedra' },
  ];

  const airports = [
    { name: 'Santiago – Rosalía de Castro', code: 'SCQ', city: 'Santiago de Compostela' },
    { name: 'A Coruña', code: 'LCG', city: 'A Coruña' },
    { name: 'Vigo – Peinador', code: 'VGO', city: 'Vigo' },
  ];

  const [invited, setInvited] = useState<boolean | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | undefined>(undefined);

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

  // Saber si ya tiene cookie de invitado
  useEffect(() => {
    fetch('/api/invite/status', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setInvited(!!d.invited))
      .catch(() => setInvited(false));
  }, []);

  // Contador
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
      {/* ====== SECCIONES PÚBLICAS ====== */}

      {/* Hero */}
      <FadeInOnScroll>
        <section className="flex flex-col gap-10 min-h-screen justify-center items-center relative">
          <div className="relative w-full max-w-[600px] mx-auto aspect-[4/3] flex justify-center items-center">
            <video
              src="/Invitacion-video.mp4"
              autoPlay
              muted
              playsInline
              loop={false}
              onEnded={(e) => e.currentTarget.pause()}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <SlArrowDown className="text-[#363432] animate-bounce" size={30} />
          </div>
        </section>
      </FadeInOnScroll>

      {/* Frase */}
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
            {['Días', 'Hs', 'Min', 'Seg'].map((label, i) => (
              <div key={label} className="flex flex-col items-center">
                <strong>{Object.values(timeLeft)[i]}</strong>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeInOnScroll>

      {/* Ceremonia */}
      <FadeInOnScroll>
        <section className="py-12 bg-[#faf6f3]">
          <div className="container mx-auto px-4 grid md:grid-cols-1 gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <PiChurchThin size={70} />
                <GiWineGlass size={50} />
              </div>
              <h4 className="text-2xl">Ceremonia & Celebración</h4>
              <p className="text-xl">Un momento íntimo y sincero que queremos compartir con ustedes..</p>
              <button className="btn-primary mt-4" onClick={() => setIsHowToOpen(true)}>
                Cómo llegar
              </button>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Modal */}
      <HowToArriveModal
        open={isHowToOpen}
        onClose={() => setIsHowToOpen(false)}
        venueName={venueName}
        address={address}
        destLat={destLat}
        destLng={destLng}
        nearCities={nearCities}
        airports={airports}
        images={[
          'https://my-page-negiupp.s3.amazonaws.com/1761680699512.jpg',
          'https://my-page-negiupp.s3.amazonaws.com/1761680702588.jpg',
          'https://my-page-negiupp.s3.amazonaws.com/1761680708051.jpg',
          'https://my-page-negiupp.s3.amazonaws.com/1761680714088.jpg',
          'https://my-page-negiupp.s3.amazonaws.com/1761680720352.jpg',
        ]}
        coverImage="https://my-page-negiupp.s3.amazonaws.com/1761680702588.jpg"
        advisor={{
          name: 'Gladys Salamin',
          role: 'Asesora de turismo',
          phone: '+41 79 239 96 80',
          email: 'gladys.salamin@tui.ch',
          note: 'Habla frances e inglés',
        }}
      />

      {/* Nuestra historia */}
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

      {/* ====== FORMULARIO PARA RECIBIR CÓDIGO ====== */}
      {invited ? (
        <FadeInOnScroll>
          <section className="py-12 text-center">
            <p className="text-lg">¡Ya tienes acceso!</p>
            <Link href={`/${locale}/invitacion`} className="btn-primary mt-4 inline-block">
              Abrir invitación
            </Link>
          </section>
        </FadeInOnScroll>
      ) : (
        <>
          <InviteForm onSent={(emails) => setEmailSentTo(emails?.[0])} />
          {emailSentTo && (
            <p className="text-center text-sm text-gray-600 mt-2">
              Te enviamos el enlace a <strong>{emailSentTo}</strong>. Revisa tu bandeja (y spam).
            </p>
          )}
        </>
      )}
    </main>
  );
}
