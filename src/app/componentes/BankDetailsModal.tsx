'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Lora } from 'next/font/google'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

type BankAccount = {
  holder: string
  iban: string
  bankName?: string
  bic?: string
  currency?: string
  concept?: string
  note?: string
  qrImage?: string // opcional: URL de un QR para Twint/Pay, etc.
}

export default function BankDetailsModal({
  open,
  onClose,
  account,
}: {
  open: boolean
  onClose: () => void
  account: BankAccount
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const prettyIBAN = useMemo(() => {
    // Separa cada 4 caracteres para legibilidad
    return account.iban.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim()
  }, [account.iban])

  async function copy(text: string, key?: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key ?? 'all')
      setTimeout(() => setCopiedKey(null), 1200)
    } catch {
      // noop
    }
  }

  const allText = [
    `Titular: ${account.holder}`,
    `IBAN: ${account.iban}`,
    account.bankName ? `Banco: ${account.bankName}` : null,
    account.bic ? `BIC/SWIFT: ${account.bic}` : null,
    account.currency ? `Moneda: ${account.currency}` : null,
    account.concept ? `Concepto: ${account.concept}` : null,
  ].filter(Boolean).join('\n')

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
            className={`${lora.className} w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl`}
          >
            <h3 className="text-xl font-semibold text-center">Datos bancarios</h3>
            <p className="text-sm text-gray-600 text-center mt-1">
              Tu presencia es el mejor regalo 💛<br />
              Pero si quieres empujar nuestra <em>huchita viajera</em>, aquí tienes los datos ☺️
            </p>

            {/* QR opcional */}
            {account.qrImage && (
              <div className="mt-4 grid place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={account.qrImage}
                  alt="QR de pago"
                  className="w-40 h-40 rounded-lg border shadow-sm object-contain bg-[#faf6f3]"
                />
                <p className="text-xs text-gray-500 mt-1">Escanéame para donar con tu app</p>
              </div>
            )}

            <div className="mt-4 space-y-3">
              <Row
                label="Titular"
                value={account.holder}
                onCopy={() => copy(account.holder, 'holder')}
                copied={copiedKey === 'holder'}
              />
              <Row
                label="IBAN"
                value={prettyIBAN}
                rawValue={account.iban}
                mono
                onCopy={() => copy(account.iban, 'iban')}
                copied={copiedKey === 'iban'}
              />
              {account.bankName && (
                <Row
                  label="Banco"
                  value={account.bankName}
                  onCopy={() => copy(account.bankName!, 'bank')}
                  copied={copiedKey === 'bank'}
                />
              )}
              {account.bic && (
                <Row
                  label="BIC/SWIFT"
                  value={account.bic}
                  mono
                  onCopy={() => copy(account.bic!, 'bic')}
                  copied={copiedKey === 'bic'}
                />
              )}
              {account.currency && (
                <Row
                  label="Moneda"
                  value={account.currency}
                  onCopy={() => copy(account.currency!, 'currency')}
                  copied={copiedKey === 'currency'}
                />
              )}
              {account.concept && (
                <Row
                  label="Concepto"
                  value={account.concept}
                  onCopy={() => copy(account.concept!, 'concept')}
                  copied={copiedKey === 'concept'}
                />
              )}
            </div>

            {account.note && (
              <p className="text-xs text-gray-500 mt-3">{account.note}</p>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => copy(allText, 'all')}
                className="flex-1 rounded-xl border px-4 py-2"
              >
                {copiedKey === 'all' ? '¡Copiado!' : 'Copiar todo'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#d49e7a] text-white px-4 py-2"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function Row({
  label,
  value,
  mono,
  onCopy,
  copied,
}: {
  label: string
  value: string
  rawValue?: string
  mono?: boolean
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border px-3 py-2 bg-[#faf6f3]">
      <div className="min-w-0">
        <p className="text-[13px] text-gray-500">{label}</p>
        <p className={mono ? 'font-mono break-all' : 'break-words'}>{value}</p>
      </div>
      <button
        onClick={onCopy}
        className="shrink-0 rounded-lg border px-3 py-1 text-sm"
        aria-label={`Copiar ${label}`}
        title={`Copiar ${label}`}
      >
        {copied ? '¡Copiado!' : 'Copiar'}
      </button>
    </div>
  )
}
