// ./src/app/componentes/SuggestSongModal.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lora } from 'next/font/google'
import { useTranslations } from 'next-intl'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

type Props = {
  open: boolean
  onClose: () => void
  onAdded?: () => void
}

// Utilidad para extraer mensaje del backend sin usar `any`
async function extractServerMessage(res: Response): Promise<string | null> {
  try {
    const data: unknown = await res.json()
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const msg = (obj.error ?? obj.message)
      return typeof msg === 'string' ? msg : null
    }
  } catch {
    /* respuesta no-JSON o vacía */
  }
  return null
}

export default function SuggestSongModal({ open, onClose, onAdded }: Props) {
  const [songName, setSongName] = useState('')
  const [artist, setArtist] = useState('')
  const [personName, setPersonName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
const t = useTranslations('invited-confirmed.songs');
  const reset = () => {
    setSongName('')
    setArtist('')
    setPersonName('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!songName.trim() || !artist.trim() || !personName.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songName, artist, personName }),
      })

      if (!res.ok) {
        const msg = await extractServerMessage(res)
        throw new Error(msg || 'No se pudo guardar la canción.')
      }

      onClose()
      reset()
      onAdded?.()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'No se pudo guardar la canción.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[1000] bg-black/50 grid place-items-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className={`${lora.className} w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-center">{t('form.title')}</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              {t('form.sub')}
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-sm text-gray-700">{t('form.name')}</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  placeholder={t('form.ejempl')}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">{t('form.artist')}</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder={t('form.ejempl-artist')}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">{t('form.person')}</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder={t('form.ejempl-person')}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border px-4 py-2"
                  disabled={loading}
                >
                  {t('form.cancelar')}
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#d49e7a] text-white px-4 py-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Guardando…' : t('form.btn')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
