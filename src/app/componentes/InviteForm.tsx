'use client'
import { useEffect, useRef, useState } from 'react'
import { Lora } from 'next/font/google'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
})

type GroupInfo = {
  preferredLanguage?: 'es' | 'fr' | 'en' | 'de' | 'it'
  notes?: string
}

type GuestInput = {
  firstName: string
  lastName: string
  email?: string
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
  // Gate local: si ya enviaste, no muestres el form
  const [alreadySent, setAlreadySent] = useState(false)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('rsvp:sent')
      if (raw) setAlreadySent(true)
    } catch {}
  }, [])

  const [primary, setPrimary] = useState<Required<Pick<GuestInput, 'firstName' | 'lastName' | 'email'>> & Omit<GuestInput, 'email'>>({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    isChild: false,
    phone: '',
    allergies: '',
    dietary: 'none',
    dietaryOther: '',
    mobilityNeeds: '',
    songSuggestion: '',
  })

  const [companions, setCompanions] = useState<GuestInput[]>([])
  const [group, setGroup] = useState<GroupInfo>({ preferredLanguage: 'es', notes: '' })

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const fieldBase =
    'border rounded-xl p-3 text-[15px] leading-6 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#d49e7a]/40 focus:border-[#d49e7a]'

  const validEmail = (s?: string) => !!s && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)
  const validAge = (v: number | '') => v !== '' && Number.isFinite(+v) && +v >= 0 && +v <= 120

  function updatePrimary<K extends keyof typeof primary>(k: K, v: (typeof primary)[K]) {
    setPrimary((p) => ({ ...p, [k]: v }))
  }
  function updateCompanion(idx: number, patch: Partial<GuestInput>) {
    setCompanions((arr) => arr.map((g, i) => (i === idx ? { ...g, ...patch } : g)))
  }
  function addCompanion() {
    setCompanions((arr) => [...arr, { firstName: '', lastName: '', email: '', age: '', dietary: 'none', isChild: false }])
  }
  function removeCompanion(idx: number) {
    setCompanions((arr) => arr.filter((_, i) => i !== idx))
  }

  useEffect(() => {
    if (loading) {
      setProgress(12)
      progressTimer.current = setInterval(() => {
        setProgress((p) => (p < 90 ? Math.min(90, p + Math.random() * 10) : p))
      }, 260)
    } else if (progressTimer.current) {
      clearInterval(progressTimer.current)
    }
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current)
    }
  }, [loading])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true); setErr(null); setMsg(null)

    // Gate local: si ya enviaste, evita doble envío
    if (alreadySent) {
      setLoading(false)
      setMsg('Ya registraste tu asistencia desde este navegador. Revisa tu correo (incluido Spam/Promociones).')
      return
    }

    // Validación contacto principal
    if (!primary.firstName || !primary.lastName || !validEmail(primary.email)) {
      setErr('Revisa nombre, apellidos y correo del contacto principal.')
      setLoading(false); return
    }
    if (!validAge(primary.age)) {
      setErr('Indica una edad válida (0 a 120) para el contacto principal.')
      setLoading(false); return
    }
    if (primary.isChild && Number(primary.age) >= 18) {
      setErr('El contacto principal no puede ser “niño/niña” con edad 18 o más.')
      setLoading(false); return
    }
    // Validación acompañantes
    for (const g of companions) {
      if (!g.firstName || !g.lastName) {
        setErr('Cada acompañante debe tener nombre y apellidos.')
        setLoading(false); return
      }
      if (!validAge(g.age)) {
        setErr('Indica una edad válida (0 a 120) para cada acompañante.')
        setLoading(false); return
      }
      if (g.isChild && Number(g.age) >= 18) {
        setErr('Marcaste “niño/niña” con edad 18 o más en un acompañante. Corrige la edad o desmarca la opción.')
        setLoading(false); return
      }
      if (g.email && !validEmail(g.email)) {
        setErr(`El correo de ${g.firstName} ${g.lastName} no es válido.`)
        setLoading(false); return
      }
    }

    // Payload normalizado (lo que espera tu API Invitation)
    const normalizedGuests = [
      {
        role: 'primary' as const,
        firstName: primary.firstName,
        lastName: primary.lastName,
        targetEmail: primary.email,
        originalGuestEmail: primary.email,
        age: Number(primary.age),
        isChild: !!primary.isChild,
        phone: primary.phone || '',
        allergies: primary.allergies || '',
        dietary: primary.dietary || 'none',
        dietaryOther: primary.dietaryOther || '',
        mobilityNeeds: primary.mobilityNeeds || '',
        songSuggestion: primary.songSuggestion || '',
      },
      ...companions.map((g) => ({
        role: 'companion' as const,
        firstName: g.firstName,
        lastName: g.lastName,
        targetEmail: validEmail(g.email) ? g.email! : primary.email, // fallback al contacto
        originalGuestEmail: g.email || null,
        age: Number(g.age),
        isChild: !!g.isChild,
        phone: g.phone || '',
        allergies: g.allergies || '',
        dietary: g.dietary || 'none',
        dietaryOther: g.dietaryOther || '',
        mobilityNeeds: g.mobilityNeeds || '',
        songSuggestion: g.songSuggestion || '',
      })),
    ]

    const payload = {
      group: {
        preferredLanguage: group.preferredLanguage || 'es',
        notes: group.notes || '',
        contactName: `${primary.firstName} ${primary.lastName}`,
        contactEmail: primary.email,
        contactPhone: primary.phone || '',
      },
      guests: normalizedGuests,
    }

    // 🔎 Debug útil: verifica que guests tenga 1 + acompañantes
    console.log('RSVP payload →', payload)

    try {
      const res = await fetch('/api/invite/request-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({} as any))

      if (res.ok) {
        setProgress(100)
        const recipientList = normalizedGuests.map((g) => g.targetEmail)
        setMsg('¡Gracias! Enviamos los enlaces de acceso al correo indicado.')
        try {
          localStorage.setItem('rsvp:sent', JSON.stringify({
            contactEmail: primary.email,
            recipients: recipientList,
            at: Date.now(),
          }))
          setAlreadySent(true)
        } catch {}
        onSent?.(recipientList)
      } else {
        setErr(data?.message || 'No pudimos procesar el formulario. Intenta nuevamente en unos minutos.')
      }
    } catch {
      setErr('Ocurrió un error de red. Intenta nuevamente.')
    } finally {
      setTimeout(() => setLoading(false), 380)
    }
  }

  if (alreadySent) {
    return (
      <section className={`py-12 bg-[#faf6f3] ${lora.className} mx-2`} style={{ fontFamily: lora.style.fontFamily }}>
        <div className="max-w-3xl mx-auto rounded-2xl p-6 shadow bg-white text-center">
          <h3 className="text-2xl mb-2">¡Formulario enviado!</h3>
          <p className="text-sm text-[#666]">
            Revisa tu bandeja de entrada. Si no encuentras el correo, mira en <strong>Spam</strong> o <strong>Promociones</strong>.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-12 bg-[#faf6f3] ${lora.className} mx-2`} style={{ fontFamily: lora.style.fontFamily }}>
      <div className="max-w-3xl mx-auto rounded-2xl p-6 shadow bg-white">
        {loading && (
          <div className="w-full h-2 bg-[#f1e8e1] rounded-md overflow-hidden mb-4">
            <div className="h-full bg-[#d49e7a] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <h3 className="text-2xl mb-2 text-center">Confirma tu asistencia</h3>
        <p className="text-sm text-center text-[#666] mb-6">
          Completa tus datos como <strong>contacto principal</strong> y, si corresponde, agrega a tus acompañantes.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-8" aria-busy={loading}>
          {/* Contacto principal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-semibold">Contacto principal (tú)</h4>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input className={fieldBase} placeholder="Nombre" value={primary.firstName}
                     onChange={(e) => updatePrimary('firstName', e.target.value)} disabled={loading} />
              <input className={fieldBase} placeholder="Apellidos" value={primary.lastName}
                     onChange={(e) => updatePrimary('lastName', e.target.value)} disabled={loading} />

              <input className={fieldBase} placeholder="Tu correo (recibirás el enlace)"
                     value={primary.email} onChange={(e) => updatePrimary('email', e.target.value)} disabled={loading} />

              <input className={fieldBase} placeholder="Tu teléfono (opcional)"
                     value={primary.phone || ''} onChange={(e) => updatePrimary('phone', e.target.value)} disabled={loading} />

              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                <input type="number" min={0} max={120} className={fieldBase}
                       placeholder={primary.isChild ? 'Edad del niño/niña' : 'Edad'}
                       value={primary.age}
                       onChange={(e) => updatePrimary('age', e.target.value === '' ? '' : Number(e.target.value))}
                       disabled={loading} />
                <label className="flex items-center gap-2 border rounded-xl px-3">
                  <input type="checkbox" checked={!!primary.isChild}
                         onChange={(e) => updatePrimary('isChild', e.target.checked)} disabled={loading} />
                  ¿Eres niño/niña?
                </label>
              </div>

              <input className={fieldBase + ' md:col-span-2'} placeholder="Alergias (si aplica)"
                     value={primary.allergies || ''} onChange={(e) => updatePrimary('allergies', e.target.value)}
                     disabled={loading} />

              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                <select className={fieldBase} value={primary.dietary || 'none'}
                        onChange={(e) => updatePrimary('dietary', e.target.value as GuestInput['dietary'])}
                        disabled={loading}>
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

                {primary.dietary === 'other' && (
                  <input className={fieldBase} placeholder="Especifica la dieta"
                         value={primary.dietaryOther || ''}
                         onChange={(e) => updatePrimary('dietaryOther', e.target.value)}
                         disabled={loading} />
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3 md:col-span-2">
                <input className={fieldBase} placeholder="Necesidades de movilidad / accesibilidad (opcional)"
                       value={primary.mobilityNeeds || ''} onChange={(e) => updatePrimary('mobilityNeeds', e.target.value)}
                       disabled={loading} />
                <input className={fieldBase} placeholder="Canción que te gustaría oír (opcional)"
                       value={primary.songSuggestion || ''} onChange={(e) => updatePrimary('songSuggestion', e.target.value)}
                       disabled={loading} />
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-semibold">Preferencias</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <select className={fieldBase} value={group.preferredLanguage || 'es'}
                      onChange={(e) => setGroup((g) => ({ ...g, preferredLanguage: e.target.value as GroupInfo['preferredLanguage'] }))}
                      disabled={loading}>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
              </select>
              <textarea className={`${fieldBase} md:col-span-1`} placeholder="Notas para la pareja (opcional)" rows={3}
                        value={group.notes || ''} onChange={(e) => setGroup((g) => ({ ...g, notes: e.target.value }))} disabled={loading} />
            </div>
          </div>

          {/* Acompañantes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-semibold">Acompañantes (opcional)</h4>
              <button type="button" onClick={addCompanion} disabled={loading} className="px-4 py-2 rounded-xl border">
                + Añadir acompañante
              </button>
            </div>

            {companions.length > 0 && (
              <div className="flex flex-col gap-6">
                {companions.map((g, idx) => (
                  <div key={idx} className="border rounded-2xl p-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <input className={fieldBase} placeholder="Nombre"
                             value={g.firstName} onChange={(e) => updateCompanion(idx, { firstName: e.target.value })} disabled={loading} />
                      <input className={fieldBase} placeholder="Apellidos"
                             value={g.lastName} onChange={(e) => updateCompanion(idx, { lastName: e.target.value })} disabled={loading} />

                      <input className={fieldBase} placeholder="Correo del acompañante (opcional)"
                             value={g.email || ''} onChange={(e) => updateCompanion(idx, { email: e.target.value })} disabled={loading} />

                      <div className="grid grid-cols-2 gap-3">
                        <input type="number" min={0} max={120} className={fieldBase}
                               placeholder={g.isChild ? 'Edad del niño/niña' : 'Edad'}
                               value={g.age} onChange={(e) => updateCompanion(idx, { age: e.target.value === '' ? '' : Number(e.target.value) })}
                               disabled={loading} />
                        <label className="flex items-center gap-2 border rounded-xl px-3">
                          <input type="checkbox" checked={!!g.isChild}
                                 onChange={(e) => updateCompanion(idx, { isChild: e.target.checked })} disabled={loading} />
                          ¿Es niño/niña?
                        </label>
                      </div>

                      <input className={fieldBase} placeholder="Teléfono (opcional)"
                             value={g.phone || ''} onChange={(e) => updateCompanion(idx, { phone: e.target.value })} disabled={loading} />

                      <input className={fieldBase + ' md:col-span-2'} placeholder="Alergias (si aplica)"
                             value={g.allergies || ''} onChange={(e) => updateCompanion(idx, { allergies: e.target.value })} disabled={loading} />

                      <div className="grid grid-cols-2 gap-3 md:col-span-2">
                        <select className={fieldBase} value={g.dietary || 'none'}
                                onChange={(e) => updateCompanion(idx, { dietary: e.target.value as GuestInput['dietary'] })}
                                disabled={loading}>
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
                                 value={g.dietaryOther || ''} onChange={(e) => updateCompanion(idx, { dietaryOther: e.target.value })}
                                 disabled={loading} />
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 md:col-span-2">
                        <input className={fieldBase} placeholder="Necesidades de movilidad / accesibilidad (opcional)"
                               value={g.mobilityNeeds || ''} onChange={(e) => updateCompanion(idx, { mobilityNeeds: e.target.value })}
                               disabled={loading} />
                        <input className={fieldBase} placeholder="Canción que le gustaría oír (opcional)"
                               value={g.songSuggestion || ''} onChange={(e) => updateCompanion(idx, { songSuggestion: e.target.value })}
                               disabled={loading} />
                      </div>
                    </div>

                    <div className="text-right mt-3">
                      <button type="button" onClick={() => removeCompanion(idx)} disabled={loading} className="text-sm underline">
                        Quitar acompañante
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {msg && <p className="text-sm text-green-700">{msg}</p>}

          <div className="text-center">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Enviando…' : 'Confirmar asistencia'}
            </button>
            {!loading && (
              <p className="text-xs text-[#777] mt-3">
                Si no ves el correo, revisa <strong>Spam</strong> o <strong>Promociones</strong>.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
