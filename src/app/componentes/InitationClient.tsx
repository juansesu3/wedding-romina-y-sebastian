// app/[locale]/invitacion/parts/InvitacionClient.tsx
'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FadeInOnScroll from '@/app/componentes/FadeScroll'
import { GiPartyPopper, GiTravelDress, GiWineGlass } from 'react-icons/gi'
import { IoCameraOutline } from 'react-icons/io5'
import { CiGift } from 'react-icons/ci'
import { PiChurchThin } from 'react-icons/pi'
import clsx from 'clsx'
import HowToArriveModal from './HowToArriveModal'
import SuggestSongModal from './SuggestSongModal'
import PhotoUploadModal from './PhotoUploadModal'
import BankDetailsModal from './BankDetailsModal'

import { Lora } from 'next/font/google'
import { useTranslations, useLocale } from 'next-intl'

// Lora solo para texto de lectura (no headings)
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
})

// Utilidad para aplicar Lora a textos legibles
const bodyFont = 'font-[family-name:var(--font-lora)]'

type Song = {
  _id: string
  songName: string
  artist: string
  personName: string
  createdAt?: string
}

// ——— helper para el saludo con 1 o 2 nombres (localizado) ———
function formatNamesForGreeting(names: string[], locale: string) {
  const clean = (names || []).filter(Boolean).map(s => s.trim()).filter(Boolean)
  const conjMap: Record<string, string> = { es: ' y ', fr: ' et ', en: ' & ', de: ' und ', it: ' e ' }
  const conj = conjMap[locale] ?? ' & '
  if (clean.length === 0) return 'invitado/a'
  if (clean.length === 1) return clean[0]
  // Para esta invitación mostramos solo los dos primeros (principal + 1 acompañante)
  return clean.slice(0, 2).join(conj)
}

function PlaylistInline({ version }: { version: number }) {
  const [items, setItems] = useState<Song[]>([])
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const t = useTranslations('invited-confirmed.songs')
  const max = 10

  async function fetchSongs() {
    try {
      setLoading(true)
      const res = await fetch('/api/songs', { cache: 'no-store' })
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSongs()
  }, [version])

  const visible = expanded ? items : items.slice(0, max)

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 text-left">
      <h6 className="text-lg font-semibold text-center">{t('playlist.title')}</h6>

      {loading ? (
        <p className={`text-center text-sm text-gray-500 mt-2 ${bodyFont}`}>Cargando…</p>
      ) : items.length === 0 ? (
        <p className={`text-center text-sm text-gray-500 mt-2 ${bodyFont}`}>Aún no hay sugerencias. ¡Sé el primero!</p>
      ) : (
        <>
          <ul className="mt-3 grid gap-2">
            {visible.map((s) => (
              <li key={s._id} className="rounded-xl shadow-md px-4 py-3 bg-white">
                <p className={`font-medium ${bodyFont}`}>
                  {s.songName} <span className="text-gray-500">— {s.artist}</span>
                </p>
                <p className={`text-xs text-gray-500 ${bodyFont}`}>{t('playlist.porpues')} {s.personName}</p>
              </li>
            ))}
          </ul>

          {items.length > max && (
            <div className="flex justify-center mt-3">
              <button
                onClick={() => setExpanded((v) => !v)}
                className={`rounded-xl border px-4 py-2 ${bodyFont}`}
              >
                {expanded ? 'Mostrar menos' : 'Mostrar más'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Polaroid({
  src,
  alt,
  className,
  caption,
}: {
  src: string
  alt: string
  className?: string
  caption?: string
}) {
  return (
    <div className={clsx('group absolute select-none', className)}>
      <div className="bg-white p-2 pb-6 rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/5 w-full h-full transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.02]">
        <div className="relative w-full h-full overflow-hidden rounded-[6px]">
          <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
        </div>
        {caption ? (
          <p className={`mt-1 text-center text-[11px] text-gray-600 ${bodyFont}`}>{caption}</p>
        ) : null}
      </div>
    </div>
  )
}

export default function InvitacionClient({
  // NUEVO: puedes pasar ambos nombres aquí (principal + 1 acompañante)
  names,
  // Retro-compat: si solo envías firstName, también funciona
  firstName,
  images
}: {
  names?: string[]
  firstName?: string
  images: string[]
}) {
  const t = useTranslations('invited-confirmed')
  const t2 = useTranslations('first_page')
  const locale = useLocale()

  // Resolvemos el nombre a mostrar
  const greetingNames = (names && names.length ? names : (firstName ? [firstName] : []))
  const greeting = formatNamesForGreeting(greetingNames, locale)

  const [isBankOpen, setIsBankOpen] = useState(false)
  const [isPhotoOpen, setIsPhotoOpen] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [isHowToOpen, setIsHowToOpen] = useState(false)
  const [isSuggestOpen, setIsSuggestOpen] = useState(false)
  const [songsVersion, setSongsVersion] = useState(0)

  // Ejemplo: Finca Atlántida (ajusta dirección/coords reales)
  const venueName = 'Finca Atlántida (Sens Restauración)'
  const address = t2('ceremony.modal.address')
  const destLat = 42.460423
  const destLng = -8.890235

  const nearCities = [
    { name: 'Santiago de Compostela', note: 'Centro histórico', mapsQuery: 'Santiago de Compostela' },
    { name: 'A Coruña', note: 'Costa y centro', mapsQuery: 'A Coruña' },
    { name: 'Vigo', note: 'Zona Rías Baixas', mapsQuery: 'Vigo' },
    { name: 'Pontevedra', note: 'Ciudad histórica y capital provincial', mapsQuery: 'Pontevedra' },
  ]

  const airports = [
    { name: 'Santiago – Rosalía de Castro', code: 'SCQ', city: 'Santiago de Compostela' },
    { name: 'A Coruña', code: 'LCG', city: 'A Coruña' },
    { name: 'Vigo – Peinador', code: 'VGO', city: 'Vigo' },
  ]

  const imageVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 1, duration: 3, ease: 'easeOut' }
    })
  }

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const targetDate = new Date('2026-06-25T00:00:00')
    const interval = setInterval(() => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      if (diff <= 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`min-h-dvh bg-[#faf6f3] ${lora.variable}`}>
      <FadeInOnScroll>
        <div className='mx-auto pt-23'>
          {/* h1 usa tu font de títulos desde globals.css */}
          <h1 className="text-3xl font-semibold mb-2 text-center">
            {t('title')} {greeting}!
          </h1>
          <p className={`text-lg text-muted-foreground mb-6 text-center ${bodyFont}`}>
            {t('text')}
          </p>
          <div className="mt-6 flex justify-center">
            <span className={`inline-block text-[#d49e7a] px-6 py-3 rounded-xl text-base ${bodyFont}`}>
              {t('subtitle')}
            </span>
          </div>
        </div>
      </FadeInOnScroll>

      {/* Fecha y contador */}
      <FadeInOnScroll>
        <section className="py-10 flex flex-col items-center gap-6">
          <p className={`text-xl ${bodyFont}`}>{t2('section1-time.title')}</p>
          <h4 className="text-2xl font-extralight">{t2('section1-time.date')}</h4>
          <div className={`flex justify-center gap-6 text-lg ${bodyFont}`}>
            {[t2('section1-time.day'), t2('section1-time.hour'), t2('section1-time.minute'), t2('section1-time.second')].map((label, i) => (
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
              <h4 className="text-2xl">{t2('ceremony.title')}</h4>
              <p className={`text-xl ${bodyFont}`}>{t2('ceremony.text')}</p>
              <button
                className={`btn-primary mt-4 ${bodyFont}`}
                onClick={() => setIsHowToOpen(true)}
              >
                {t2('ceremony.button')}
              </button>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Modal Cómo llegar */}
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
          role: t2('ceremony.modal.advisor.description'),
          phone: '+41 79 239 96 80',
          email: 'gladys.salamin@tui.ch',
          note: t2('ceremony.modal.advisor.text'),
        }}
      />

      {/* Dresscode */}
      <FadeInOnScroll>
        <section className="py-16 text-center">
          <div className="flex justify-center items-center px-2">
            <div
              className={`relative w-full max-w-[400px] transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
            >
              {/* Frente */}
              <div className="absolute inset-0 h-full w-full rounded-xl shadow-lg flex flex-col justify-center items-center gap-6 p-6 bg-white [backface-visibility:hidden]">
                <GiTravelDress size={80} className="text-[clamp(3rem,8vw,6rem)] mb-4 " />
                <div className="bg-[#cacaca] h-[2px] w-1/3 mb-8" />
                <p className={`text-[clamp(1.25rem,3vw,1.75rem)] text-center ${bodyFont}`}>
                  {t('dress-code.title')}
                </p>
                <h5 className="text-[clamp(1.5rem,4vw,2rem)]">{t('dress-code.subtitle')}</h5>
                <button
                  onClick={() => setFlipped(true)}
                  className={`mt-15 px-6 py-3 bg-black text-white rounded-lg hover:bg-[#333] transition text-[clamp(0.9rem,2.5vw,1.1rem)] ${bodyFont}`}
                >
                  {t('dress-code.btn')}
                </button>
              </div>

              {/* Dorso */}
              <div className="w-full rounded-xl shadow-lg flex flex-col justify-start items-center p-6 bg-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <Image src={'/drescode-image.png'} alt="dresscode" className="h-52 w-52" width={500} height={500} />
                <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold mb-4">Formal</h3>
                <p className={`text-center text-[clamp(1rem,2.5vw,1.2rem)] ${bodyFont}`}>
                  {t('dress-code.text')}
                </p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <p className={bodyFont}>{t('dress-code.colors.name')}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['#c1b4ac', '#cbb39d', '#ab8360', '#b47d60'].map((color, i) => (
                      <svg key={i} viewBox="0 0 100 100" className="w-10 h-10" style={{ fill: color }}>
                        <path d="M50 0c15 10 30 10 40 25s15 30 5 45-25 25-40 25-35-5-45-20S0 35 10 20 35-10 50 0z" />
                      </svg>
                    ))}
                  </div>
                  <p className={bodyFont}>{t('dress-code.colors.title')}</p>
                </div>
                <button
                  onClick={() => setFlipped(false)}
                  className={`mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-[#333] transition text-[clamp(0.9rem,2.5vw,1.1rem)] ${bodyFont}`}
                >
                  {t('dress-code.colors.btn')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Galería */}
      <section className="py-12 bg-[#faf6f3]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center font-semibold mb-8">{t('galery.name')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <motion.div key={index} custom={index} initial="hidden" animate="visible" variants={imageVariants}>
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

      {/* Extras */}
      {[
        {
          icon: <GiPartyPopper size={60} />,
          title: t('songs.title'),
          text: t('songs.text'),
          button: t('songs.btn'),
        },
        {
          icon: <IoCameraOutline size={60} />,
          title: t('songs.photos.title'),
          text: t('songs.photos.sub'),
          button: t('songs.photos.btn')
        }
      ].map(({ icon, title, text, button }, idx) => (
        <FadeInOnScroll key={idx}>
          <section className="py-12 bg-[#faf6f3] text-center px-4">
            <div className="flex flex-col items-center gap-4">
              {icon}

              <h5 className="text-2xl">{title}</h5>
              <p className={`text-xl ${bodyFont}`}>{text}</p>

              {idx === 0 ? (
                <>
                  <PlaylistInline version={songsVersion} />
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button className={`btn-primary ${bodyFont}`} onClick={() => setIsSuggestOpen(true)}>
                      {button}
                    </button>
                  </div>
                </>
              ) : (
                <button className={`btn-primary mt-6 ${bodyFont}`} onClick={() => setIsPhotoOpen(true)}>
                  {button}
                </button>
              )}
            </div>
          </section>
        </FadeInOnScroll>
      ))}

      <FadeInOnScroll>
        <section className="grid md:grid-cols-1">
          <div className="flex flex-col items-center justify-center bg-[#faf6f3] p-8 gap-4">
            <CiGift size={60} />
            <p className={`text-xl text-center ${bodyFont}`}>
              {t('songs.gift.title')}
            </p>
            <button className={`btn-primary mt-6 ${bodyFont}`} onClick={() => setIsBankOpen(true)}>
              {t('songs.gift.btn')}
            </button>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="pt-12 bg-[#faf6f3]">
          <div className="relative mx-auto max-w-6xl">
            {/* Móvil */}
            <div className="grid grid-cols-2 gap-3 sm:hidden">
              {[
                'https://my-page-negiupp.s3.amazonaws.com/1747832102521.jpeg',
                'https://my-page-negiupp.s3.amazonaws.com/1761826629892.JPG',
                'https://my-page-negiupp.s3.amazonaws.com/1761826633448.JPG',
                'https://my-page-negiupp.s3.amazonaws.com/1761826639088.JPG',
                'https://my-page-negiupp.s3.amazonaws.com/1761826670569.JPG',
                'https://my-page-negiupp.s3.amazonaws.com/1761826677453.JPG',
              ].map((src, i) => (
                <div key={i} className="bg-white p-2 pb-6 rounded-md shadow-md">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                    <Image src={src} alt={`Polaroid ${i + 1}`} fill className="object-cover" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/Tablet */}
            <div className="hidden sm:block relative h-[70vh] md:h-[60vh] lg:h-[55vh]">
              <Polaroid
                src="https://my-page-negiupp.s3.amazonaws.com/1747832102521.jpeg"
                alt="Central"
                className="top-[18%] left-1/2 -translate-x-1/2 z-30 rotate-[-3deg] w-48 h-60 md:w-64 md:h-80"
              />
              <Polaroid
                src="https://my-page-negiupp.s3.amazonaws.com/1761826629892.JPG"
                alt="Lado izq 1"
                className="top-[8%] left-[6%] z-20 rotate-[-8deg] w-40 h-52 md:w-56 md:h-72"
              />
              <Polaroid
                src="https://my-page-negiupp.s3.amazonaws.com/1761826633448.JPG"
                alt="Lado der 1"
                className="top-[12%] right-[8%] z-10 rotate-[7deg] w-40 h-52 md:w-56 md:h-72"
              />
              <Polaroid
                src="https://my-page-negiupp.s3.amazonaws.com/1761826639088.JPG"
                alt="Inferior izq"
                className="bottom-[6%] left-[14%] z-10 rotate-[4deg] w-44 h-56 md:w-60 md:h-72"
              />
              <Polaroid
                src="https://my-page-negiupp.s3.amazonaws.com/1761826670569.JPG"
                alt="Inferior der"
                className="bottom-[4%] right-[16%] z-20 rotate-[-6deg] w-44 h-56 md:w-60 md:h-72"
              />
              <Polaroid
                src="https://my-page-negiupp.s3.amazonaws.com/1761826677453.JPG"
                alt="Superior centro"
                className="top-[2%] left-1/3 z-10 rotate-[2deg] w-36 h-48 md:w-52 md:h-64"
              />
            </div>
          </div>

          <p className="bg-[#d49e7a] text-white text-lg p-8 text-center">
            {t('songs.finish.title')}
          </p>
        </section>
      </FadeInOnScroll>

      {/* Modales */}
      <SuggestSongModal
        open={isSuggestOpen}
        onClose={() => setIsSuggestOpen(false)}
        onAdded={() => setSongsVersion(v => v + 1)}
      />
      <PhotoUploadModal
        open={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
        availabilityDate="2026-06-25T00:00:00"
      />
      <BankDetailsModal
        open={isBankOpen}
        onClose={() => setIsBankOpen(false)}
        account={{
          holder: 'Suarez Ramirez R. & Suarez Ramirez',
          iban: 'CH03 0840 1000 0795 5820 8',
          bankName: 'Banque Migros SA',
          bic: 'MIGRCHZZXXX',
          currency: 'CHF',
          concept: 'Regalo de boda — Juan & Romina',
          note: 'Si prefieres efectivo, prometemos invertirlo en abrazos y buen café ☕️💛',
        }}
      />
    </div>
  )
}
