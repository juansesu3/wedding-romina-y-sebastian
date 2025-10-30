// app/[locale]/acces/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

export default function AccesPage() {
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const search = useSearchParams()
  const locale = params?.locale || 'es'
  const token = search.get('token')
  const [message, setMessage] = useState('Validando tu enlace…')

  useEffect(() => {
    async function run() {
      if (!token) {
        router.replace(`/${locale}/reenvio?reason=missing`)
        return
      }
      try {
        const res = await fetch(`/api/acces?token=${encodeURIComponent(token)}&locale=${locale}`, {
          credentials: 'same-origin',
          cache: 'no-store',
          method: 'GET',
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data?.ok) {
          router.replace(data.redirect || `/${locale}/invitation`)
        } else {
          router.replace(data?.redirect || `/${locale}/reenvio?reason=invalid`)
        }
      } catch {
        setMessage('Ocurrió un error al validar. Intenta nuevamente.')
      }
    }
    run()
  }, [token, locale, router])

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#faf6f3] px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Acceso</h1>
        <p className="mt-2 text-gray-600">{message}</p>
      </div>
    </main>
  )
}
