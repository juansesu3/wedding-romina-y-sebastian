// app/componentes/HowToArriveModal.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Lora } from 'next/font/google'
import Image from 'next/image'
import { motion } from 'framer-motion'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
})

type NearCity = { name: string; note?: string; mapsQuery?: string }
type Airport = { name: string; code: string; city?: string; note?: string }
type Advisor = {
  name: string
  role?: string
  phone?: string
  email?: string
  note?: string // ej. "Habla español / inglés"
}

export default function HowToArriveModal({
  open,
  onClose,
  venueName,
  address,
  destLat,
  destLng,
  nearCities = [],
  airports = [],
  images = [],
  coverImage,
  advisor,
}: {
  open: boolean
  onClose: () => void
  venueName: string
  address: string
  destLat?: number
  destLng?: number
  nearCities?: NearCity[]
  airports?: Airport[]
  images?: string[]
  coverImage?: string
  advisor?: Advisor
}) {
  const [origin, setOrigin] = useState<string>('')
  const [locAllowed, setLocAllowed] = useState<boolean | null>(null)

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const hasCoords = typeof destLat === 'number' && typeof destLng === 'number'
  const destinationParam = useMemo(() => {
    return hasCoords ? `${destLat},${destLng}` : encodeURIComponent(address)
  }, [hasCoords, destLat, destLng, address])

  // Embed de mapa sin API key (place search o lat/lng)
  const mapSrc = useMemo(() => {
    if (hasCoords) return `https://www.google.com/maps?q=${destLat},${destLng}&hl=es;z=14&output=embed`
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=es;z=14&output=embed`
  }, [hasCoords, destLat, destLng, address])

  function makeGoogleLink() {
    const base = 'https://www.google.com/maps/dir/?api=1'
    const params = new URLSearchParams({ destination: destinationParam, travelmode: 'driving' })
    if (origin.trim()) params.set('origin', origin.trim())
    return `${base}&${params.toString()}`
  }

  function makeAppleLink() {
    const base = 'http://maps.apple.com/'
    const params = new URLSearchParams({ daddr: destinationParam })
    if (origin.trim()) params.set('saddr', origin.trim())
    return `${base}?${params.toString()}`
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setLocAllowed(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocAllowed(true)
        const { latitude, longitude } = pos.coords
        setOrigin(`${latitude},${longitude}`)
      },
      () => setLocAllowed(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-2 ${lora.variable} font-sans `}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        // 📱 Full-height en móvil con scroll interno; auto en desktop
        className="w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-[100dvh] sm:max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contenedor scrollable con momentum scroll en iOS y sin scroll-bleed */}
        <div
          className="flex flex-col h-full overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' as any }}
        >
          {/* Handle para arrastrar/cerrar en móvil */}
          <div className="sm:hidden grid place-items-center py-2">
            <div className="h-1.5 w-12 rounded-full bg-black/15" />
          </div>

          {/* HERO VISUAL */}
          <div className="relative aspect-[3/1] bg-[#f0e7df]">
            {coverImage ? (
              <Image src={coverImage} alt={`${venueName} – portada`} fill className="object-cover" sizes="100vw" />
            ) : (
              <div className="w-full h-full grid place-items-center text-[#b08968]">
                <span className="text-xl">{venueName}</span>
              </div>
            )}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-3 top-3 rounded-xl bg-white/90 px-3 py-1.5 text-sm shadow hover:bg-white"
            >
              Cerrar
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="p-4  space-y-8 text-center pb-[calc(env(safe-area-inset-bottom,0)+16px)]">
            {/* Título + dirección */}
            <div>
              <h3 className="font-[family-name:var(--font-lora)] text-2xl sm:text-3xl leading-tight">Cómo llegar</h3>
              <p className="mt-2 text-sm uppercase tracking-wide text-[#b08968]">{venueName}</p>
              <p className="text-gray-700">{address}</p>
            </div>

            {/* MAPA INTERACTIVO */}
            <div className="rounded-2xl overflow-hidden border shadow-sm">
              <iframe
                src={mapSrc}
                className="w-full h-[40vh] min-h-[260px] sm:h-[360px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Mapa de ubicación"
              />
            </div>

            {/* GALERÍA */}
            {images.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Un vistazo a la finca</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.slice(0, 6).map((src, i) => (
                    <motion.div
                      key={src + i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden"
                    >
                      <Image
                        src={src}
                        alt={`${venueName} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* INFO DE CONTEXTO */}
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {/* Ciudades cercanas */}
              {nearCities.length > 0 && (
                <div className="rounded-2xl border p-4">
                  <p className="font-medium mb-2">Ciudades cercanas</p>
                  <ul className="space-y-1 text-sm leading-6">
                    {nearCities.map((c, i) => (
                      <li key={i}>
                        {c.mapsQuery ? (
                          <a
                            className="underline underline-offset-2"
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapsQuery)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {c.name}
                          </a>
                        ) : (
                          c.name
                        )}
                        {c.note ? <span className="text-gray-500"> — {c.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Aeropuertos cercanos */}
              {airports.length > 0 && (
                <div className="rounded-2xl border p-4">
                  <p className="font-medium mb-2">Aeropuertos cercanos</p>
                  <ul className="space-y-1 text-sm leading-6">
                    {airports.map((a, i) => (
                      <li key={i}>
                        <span className="font-medium">{a.name}</span> ({a.code})
                        {a.city ? <span className="text-gray-600"> — {a.city}</span> : null}
                        {a.note ? <span className="text-gray-500"> — {a.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ASESOR TURÍSTICO / ASISTENCIA */}
            {advisor && (
              <div className="rounded-2xl border p-4 text-left bg-[#faf9f7]">
                <p className="font-medium mb-1">Asistencia / Turismo</p>
                <p className="text-sm leading-6">
                  <span className="font-medium">{advisor.name}</span>
                  {advisor.role ? <span className="text-gray-600"> — {advisor.role}</span> : null}
                  {advisor.note ? <span className="text-gray-500"> · {advisor.note}</span> : null}
                </p>

                <div className="mt-2 text-sm leading-6 space-y-1">
                  {advisor.phone && (
                    <p>
                      Tel:{' '}
                      <a
                        href={`tel:${advisor.phone.replace(/\s+/g, '')}`}
                        className="underline underline-offset-2"
                      >
                        {advisor.phone}
                      </a>
                    </p>
                  )}

                  {advisor.email && (
                    <p>
                      Email:{' '}
                      <a
                        href={`mailto:${advisor.email}`}
                        className="underline underline-offset-2 break-all"
                      >
                        {advisor.email}
                      </a>
                    </p>
                  )}
                </div>

                <p className="text-[13px] text-gray-500 mt-3">
                  Si necesitas ayuda con alojamiento o transporte local, puedes contactarla directamente.
                </p>
              </div>
            )}

            {/* PLANIFICADOR */}
            <div className="border rounded-2xl p-4 sm:p-5 space-y-3 text-left">
              <p className="font-medium text-center sm:text-left">Planificar ruta</p>
              <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3">
                <input
                  type="text"
                  className="w-full rounded-xl border px-3 py-2"
                  placeholder='Tu origen (ej. "Praza do Obradoiro, Santiago" o lat,lng)'
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                <button onClick={useMyLocation} className="rounded-xl border px-4 py-2">
                  Usar mi ubicación
                </button>
                <a
                  href={makeGoogleLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border px-4 py-2 text-center"
                >
                  Google Maps
                </a>
                <a
                  href={makeAppleLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border px-4 py-2 text-center sm:col-start-3"
                >
                  Apple Maps
                </a>
              </div>
              {locAllowed === false && (
                <p className="text-xs text-red-600">
                  No pudimos acceder a tu ubicación. Escribe una dirección arriba.
                </p>
              )}
              <p className="text-[13px] text-gray-500">
                Tip: Si escribes tu origen como <code>lat,lng</code> (ej. <code>42.8782,-8.5448</code>) la ruta será más precisa.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
