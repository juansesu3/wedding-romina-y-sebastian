'use client'
import { useState } from 'react'
import InviteForm from '@/app/componentes/InviteForm'

function SuccessPanel({ emails, onReset }: { emails: string[]; onReset: () => void }) {
  const multiple = emails.length > 1
  return (
    <section className="py-12 bg-[#faf6f3]">
      <div className="max-w-3xl mx-auto rounded-2xl p-6 shadow bg-white text-center">
        <h3 className="text-2xl mb-2">¡Listo! Revisa tu correo</h3>
        <p className="text-[#666] mb-4">
          {multiple ? 'Enviamos un enlace de acceso personal a:' : 'Enviamos un enlace de acceso personal a:'}
        </p>
        <ul className="mb-6">{emails.map(e => <li key={e} className="text-sm">{e}</li>)}</ul>
        <p className="text-sm text-[#666] mb-6">
          Si no lo ves, revisa <strong>spam</strong> o <strong>promociones</strong>.
        </p>
        <button onClick={onReset} className="px-4 py-2 rounded-xl border">Volver al formulario</button>
      </div>
    </section>
  )
}

export default function InvitePage() {
  const [emailsSentTo, setEmailsSentTo] = useState<string[] | null>(null)
  return !emailsSentTo
    ? <InviteForm onSent={(emails) => setEmailsSentTo(emails)} />
    : <SuccessPanel emails={emailsSentTo} onReset={() => setEmailsSentTo(null)} />
}
