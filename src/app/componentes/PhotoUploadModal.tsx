'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Lora } from 'next/font/google'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function PhotoUploadModal({
  open,
  onClose,
  availabilityDate = '2026-06-25T00:00:00', // se habilita el día de la boda
}: {
  open: boolean
  onClose: () => void
  availabilityDate?: string
}) {
  const now = new Date()
  const availableFrom = new Date(availabilityDate)
  const isAvailable = now >= availableFrom

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[1000] bg-black/50 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`${lora.className} w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center`}
          >
            <h3 className="text-xl font-semibold">Sube tus fotos</h3>

            {!isAvailable ? (
              <>
                <p className="text-sm text-gray-600 mt-2">
                  Aquí podrás subir las fotos el <strong>día de la boda</strong>.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Se habilitará el <strong>25 de junio de 2026</strong>.
                </p>
                <div className="mt-4 rounded-xl border px-4 py-3 bg-[#faf6f3]">
                  <p className="text-sm">
                    Hasta entonces, el álbum está en <em>modo sorpresa</em> 🤫. Prometemos aceptar:
                    <br />
                    selfies, fotos movidas de la pista y evidencia del{' '}
                    <span className="italic">pasito prohibido</span> 🕺📸
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-[#d49e7a] text-white px-5 py-2"
                >
                  ¡Entendido!
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 mt-2">
                  ¡El álbum está abierto! 🎉 Muy pronto podrás subir aquí tus fotos.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Si tu cámara captó el baile épico del tío… este es el lugar 😄
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-[#d49e7a] text-white px-5 py-2"
                >
                  Cerrar
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
