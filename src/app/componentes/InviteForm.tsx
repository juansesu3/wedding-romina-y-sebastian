'use client'
import { useState } from 'react'
import { Lora } from 'next/font/google'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
})

type GuestInput = {
  firstName: string
  lastName: string
  email: string
  age: number | ''
  isChild?: boolean
  phone?: string
  allergies?: string
  dietary?: 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten_free' | 'halal' | 'kosher' | 'no_pork' | 'no_alcohol' | 'other'
  dietaryOther?: string
  mobilityNeeds?: string
  songSuggestion?: string
}

export default function InviteForm({ onSent }: { onSent?: (emails: string[]) => void }) {
  const [guests, setGuests] = useState<GuestInput[]>([
    { firstName: '', lastName: '', email: '', age: '', dietary: 'none', isChild: false },
  ])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  function updateGuest(idx: number, patch: Partial<GuestInput>) {
    setGuests((arr) => arr.map((g, i) => (i === idx ? { ...g, ...patch } : g)))
  }

  function addGuest() {
    setGuests((arr) => [...arr, { firstName: '', lastName: '', email: '', age: '', dietary: 'none', isChild: false }])
  }

  function removeGuest(idx: number) {
    setGuests((arr) => (arr.length > 1 ? arr.filter((_, i) => i !== idx) : arr))
  }

  function validEmail(s: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)
  }
  function validAge(v: number | '') {
    if (v === '') return false
    const n = Number(v)
    return Number.isFinite(n) && n >= 0 && n <= 120
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErr(null); setMsg(null)

    for (const g of guests) {
      if (!g.firstName || !g.lastName || !validEmail(g.email)) {
        setErr('Revisa nombre, apellidos y correo de cada invitado.')
        setLoading(false); return
      }
      if (!validAge(g.age)) {
        setErr('Indica una edad válida (0 a 120) para cada invitado.')
        setLoading(false); return
      }
      if (g.isChild && Number(g.age) >= 18) {
        setErr('Marcaste "niño/niña" con edad 18 o más. Corrige la edad o desmarca la opción.')
        setLoading(false); return
      }
    }

    const res = await fetch('/api/invite/request-bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guests }),
    })
    const data = await res.json().catch(() => ({} as any))
    if (res.ok) {
      setMsg('¡Gracias! Enviamos un enlace de acceso personal a cada invitado.')
      onSent?.(guests.map(g => g.email))
    } else {
      setErr(data?.message || 'No pudimos procesar el formulario. Intenta nuevamente en unos minutos.')
    }
    setLoading(false)
  }

  const fieldBase =
    'border rounded-xl p-3 text-[15px] leading-6 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#d49e7a]/40 focus:border-[#d49e7a]'

  return (
    <section className={`py-12 bg-[#faf6f3] ${lora.className}`} style={{ fontFamily: lora.style.fontFamily }}>
      <div className="max-w-3xl mx-auto rounded-2xl p-6 shadow bg-white">
        <h3 className="text-2xl mb-2 text-center">Confirma tu asistencia</h3>
        <p className="text-sm text-center text-[#666] mb-6">
          Completa tus datos para enviarte un <strong>enlace de acceso personal</strong> con toda la información de la boda.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-semibold">Información de los invitados</h4>
              <button type="button" onClick={addGuest} className="px-4 py-2 rounded-xl border">+ Añadir otro invitado</button>
            </div>

            <div className="flex flex-col gap-6">
              {guests.map((g, idx) => (
                <div key={idx} className="border rounded-2xl p-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <input className={fieldBase} placeholder="Nombre" value={g.firstName}
                      onChange={(e) => updateGuest(idx, { firstName: e.target.value })} />
                    <input className={fieldBase} placeholder="Apellidos" value={g.lastName}
                      onChange={(e) => updateGuest(idx, { lastName: e.target.value })} />

                    <input className={fieldBase} placeholder="Correo electrónico" value={g.email}
                      onChange={(e) => updateGuest(idx, { email: e.target.value })} />

                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" min={0} max={120} className={fieldBase}
                        placeholder={g.isChild ? 'Edad del niño/niña' : 'Edad'}
                        value={g.age} onChange={(e) => updateGuest(idx, { age: e.target.value === '' ? '' : Number(e.target.value) })} />
                      <label className="flex items-center gap-2 border rounded-xl px-3">
                        <input type="checkbox" checked={!!g.isChild}
                          onChange={(e) => updateGuest(idx, { isChild: e.target.checked })} />
                        ¿Es niño/niña?
                      </label>
                    </div>

                    <input className={fieldBase} placeholder="Teléfono (opcional)" value={g.phone || ''}
                      onChange={(e) => updateGuest(idx, { phone: e.target.value })} />

                    <input className={fieldBase + ' md:col-span-2'} placeholder="Alergias (si aplica)"
                      value={g.allergies || ''} onChange={(e) => updateGuest(idx, { allergies: e.target.value })} />

                    <div className="grid grid-cols-2 gap-3 md:col-span-2">
                      <select className={fieldBase} value={g.dietary || 'none'}
                        onChange={(e) => updateGuest(idx, { dietary: e.target.value as GuestInput['dietary'] })}>
                        <option value="none">Sin restricciones</option>
                        <option value="vegetarian">Vegetariano</option>
                        <option value="vegan">Vegano</option>
                        <option value="pescatarian">Pescetariano</option>
                        <option value="gluten_free">Sin gluten</option>
                        <option value="halal">Halal</option>
                        <option value="kosher">Kosher</option>
                        <option value="no_pork">Sin cerdo</option>
                        <option value="no_alcohol">Sin alcohol</option>
                        <option value="other">Otro</option>
                      </select>

                      {g.dietary === 'other' && (
                        <input className={fieldBase} placeholder="Especifica la dieta"
                          value={g.dietaryOther || ''} onChange={(e) => updateGuest(idx, { dietaryOther: e.target.value })} />
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 md:col-span-2">
                      <input className={fieldBase} placeholder="Necesidades de movilidad / accesibilidad (opcional)"
                        value={g.mobilityNeeds || ''} onChange={(e) => updateGuest(idx, { mobilityNeeds: e.target.value })} />
                      <input className={fieldBase} placeholder="Canción que te gustaría oír (opcional)"
                        value={g.songSuggestion || ''} onChange={(e) => updateGuest(idx, { songSuggestion: e.target.value })} />
                    </div>
                  </div>

                  {guests.length > 1 && (
                    <div className="text-right mt-3">
                      <button type="button" onClick={() => removeGuest(idx)} className="text-sm underline">
                        Quitar invitado
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {msg && <p className="text-sm text-green-700">{msg}</p>}

          <div className="text-center">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Enviando…' : 'Confirmar asistencia'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
