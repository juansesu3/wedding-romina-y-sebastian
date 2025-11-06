// src/app/[locale]/page.tsx
'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import { PiChurchThin } from 'react-icons/pi';
import { GiWineGlass } from 'react-icons/gi';
import FadeInOnScroll from '../componentes/FadeScroll';
import InviteForm from '../componentes/InviteForm';
import HowToArriveModal from '../componentes/HowToArriveModal';
import RSVPForm from '../componentes/RSVPForm';

import { Lora } from 'next/font/google';
import { useTranslations } from 'next-intl';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
});

const bodyFont = 'font-[family-name:var(--font-lora)]';
const LOCAL_NO_KEY = 'wedding-rsvp-no';
const LOCAL_YES_KEY = 'rsvp:sent';

export default function Home() {
  const t = useTranslations('first_page');


  const [isHowToOpen, setIsHowToOpen] = useState(false);
  const [rsvpChoice, setRsvpChoice] = useState<'yes' | 'no'>('yes');

  const [invited, setInvited] = useState<boolean | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | undefined>(undefined);

  const [alreadyYes, setAlreadyYes] = useState(false);
  const [alreadyNo, setAlreadyNo] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // leer estado local de sí / no y recuperar correo
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // si ya confirmó que SÍ
    const savedYes = window.localStorage.getItem(LOCAL_YES_KEY);
    if (savedYes) {
      try {
        const parsed = JSON.parse(savedYes);
        if (parsed?.contactEmail) {
          setEmailSentTo(parsed.contactEmail);
        }
      } catch {
        /* ignore */
      }
      setAlreadyYes(true);
      setRsvpChoice('yes');
    }

    // si ya confirmó que NO
    const savedNo = window.localStorage.getItem(LOCAL_NO_KEY);
    if (savedNo) {
      try {
        const parsed = JSON.parse(savedNo);
        if (parsed?.done) {
          setAlreadyNo(true);
          setRsvpChoice('no');
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  // saber si ya tiene cookie de invitado (tu API)
  useEffect(() => {
    fetch('/api/invite/status', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setInvited(!!d.invited))
      .catch(() => setInvited(false));
  }, []);

  // contador
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

  // datos ceremonia
  const venueName = t('ceremony.modal.name');
  const address = t('ceremony.modal.address');
  const destLat = 42.460423;
  const destLng = -8.890235;

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

  const videoRef = useRef<HTMLVideoElement | null>(null);

useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const tryPlay = async () => {
    try {
      await video.play();
    } catch (err) {
      // algunos navegadores móviles bloquean sin interacción → no es grave
      console.warn('Autoplay bloqueado por el navegador:', err);
    }
  };

  // Intento inicial de reproducir
  tryPlay();

  // Intento adicional al primer toque (por si se bloqueó)
  const handleTouch = () => {
    tryPlay();
    document.removeEventListener('touchstart', handleTouch);
  };
  document.addEventListener('touchstart', handleTouch);

  return () => {
    document.removeEventListener('touchstart', handleTouch);
  };
}, []);
  return (
    <main className={`min-h-screen w-full text-[#363432] bg-[#faf6f3] ${lora.variable}`}>
      {/* Hero */}
      <FadeInOnScroll>
        <section className="flex flex-col gap-10 min-h-screen justify-center items-center relative">
          <div className="relative w-full max-w-[600px] mx-auto aspect-[4/3] flex justify-center items-center">
            <video
              ref={videoRef}
              src="/Invitacion-video.mp4"
              autoPlay
              muted
              playsInline
              loop={false}
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
          <p className={`max-w-3xl mx-auto text-2xl font-light `}>{t('first-quote')}</p>
        </section>
      </FadeInOnScroll>

      {/* Fecha y contador */}
      <FadeInOnScroll>
        <section className="py-10 flex flex-col items-center gap-6">
          <p className={`text-xl ${bodyFont}`}>{t('section1-time.title')}</p>
          <h4 className="text-2xl font-extralight">{t('section1-time.date')}</h4>
          <div className={`flex justify-center gap-6 text-lg ${bodyFont}`}>
            {[t('section1-time.day'), t('section1-time.hour'), t('section1-time.minute'), t('section1-time.second')].map(
              (label, i) => (
                <div key={label} className="flex flex-col items-center">
                  <strong>{Object.values(timeLeft)[i]}</strong>
                  <p>{label}</p>
                </div>
              )
            )}
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
              <h4 className="text-2xl">{t('ceremony.title')}</h4>
              <p className={`text-xl ${bodyFont}`}>{t('ceremony.text')}</p>
              <button className={`btn-primary mt-4 ${bodyFont}`} onClick={() => setIsHowToOpen(true)}>
                {t('ceremony.button')}
              </button>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Modal cómo llegar */}
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
          role: t('ceremony.modal.advisor.description'),
          phone: '+41 79 239 96 80',
          email: 'gladys.salamin@tui.ch',
          note: t('ceremony.modal.advisor.text'),
        }}
      />

      {/* Nuestra historia */}
      <FadeInOnScroll>
        <section className="py-16 text-center">
          <h2 className="text-3xl mb-8">{t('our-hisotyr.title')}</h2>
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

      {/* ====== SECCIÓN RSVP ====== */}
      <FadeInOnScroll>
        <section className="py-10 flex flex-col items-center gap-6 w-full">
          <h3 className="text-2xl mb-2">
            {t('form-confirmation.confirmed-messages.question')}
          </h3>

          {/* 1) Ya confirmó que SÍ */}
          {alreadyYes ? (
            <>
              <p className={`text-sm text-gray-600 text-center px-4 ${lora.className}`}>
                {t('form-confirmation.confirmed-messages.yes.msg1')}
              </p>
              {emailSentTo && (
                <p className={`text-center text-sm text-gray-600 mt-2 mx-2 ${bodyFont}`}>
                  {t('form-confirmation.confirmed-messages.yes.msg2')}{' '}
                  <strong>{emailSentTo}</strong>.{' '}
                  {t('form-confirmation.confirmed-messages.yes.msg3')}
                </p>
              )}
            </>
          ) : !alreadyNo ? (
            // 2) No ha dicho ni sí ni no → mostramos el toggle
            <div className={`flex bg-white/60 border border-[#d0b7a4]/40 rounded-full overflow-hidden ${lora.className}`}>
              <button
                type="button"
                onClick={() => setRsvpChoice('yes')}
                className={`px-6 py-2 text-sm transition ${rsvpChoice === 'yes' ? 'bg-[#d0b7a4] text-white' : 'text-[#363432]'
                  }`}
              >
                {t('form-confirmation.confirmed-messages.y')}
              </button>
              <button
                type="button"
                onClick={() => setRsvpChoice('no')}
                className={`px-6 py-2 text-sm transition ${rsvpChoice === 'no' ? 'bg-[#d0b7a4] text-white' : 'text-[#363432]'
                  }`}
              >
                {t('form-confirmation.confirmed-messages.n')}
              </button>
            </div>
          ) : (
            // 3) Ya dijo que NO
            <p className={`text-sm text-gray-600 text-center px-4 ${lora.className}`}>
              {t('form-confirmation.confirmed-messages.no.msg1')}
            </p>
          )}

          {/* CONTENIDO dinámico */}
          {!alreadyYes && (
            <div className="w-full flex flex-col items-center">
              {/* flujo de SÍ, solo si NO había dicho no */}
              {rsvpChoice === 'yes' && !alreadyNo ? (
                <div className="w-full">
                  {invited ? (
                    <section className="py-6 text-center">
                      <p className={`text-lg ${bodyFont}`}>
                        {t('form-confirmation.confirmed-messages.yes.msg1')}
                      </p>
                    </section>
                  ) : (
                    <>
                      <InviteForm onSent={(emails) => setEmailSentTo(emails?.[0])} />
                      {emailSentTo && (
                        <p className={`text-center text-sm text-gray-600 mt-2 ${bodyFont}`}>
                          {t('form-confirmation.confirmed-messages.yes.msg2')}{' '}
                          <strong>{emailSentTo}</strong>.{' '}
                          {t('form-confirmation.confirmed-messages.yes.msg3')}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ) : null}

              {/* flujo de NO */}
              {rsvpChoice === 'no' && (
                <div className="w-full flex items-center justify-center">
                  <RSVPForm />
                </div>
              )}
            </div>
          )}
        </section>
      </FadeInOnScroll>
    </main>
  );
}
