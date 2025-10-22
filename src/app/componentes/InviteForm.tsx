'use client'
import { useState } from 'react'

type GuestInput = {
    firstName: string
    lastName: string
    email: string
    phone?: string
    allergies?: string
    dietary?: 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten_free' | 'halal' | 'kosher' | 'no_pork' | 'no_alcohol' | 'other'
    dietaryOther?: string
    children?: boolean
    mobilityNeeds?: string
    songSuggestion?: string
}

type HouseholdInput = {
    street: string
    city: string
    postalCode: string
    country: string
    phone?: string
    preferredLanguage?: 'es' | 'en' | 'fr' | 'de' | 'it'
    contactChannel?: 'email' | 'whatsapp' | 'sms'
    notes?: string
}

export default function InviteForm({ onSent }: { onSent?: (emails: string[]) => void }) {
    const [household, setHousehold] = useState<HouseholdInput>({
        street: '', city: '', postalCode: '', country: 'Suiza',
        preferredLanguage: 'es', contactChannel: 'email'
    })

    const [guests, setGuests] = useState<GuestInput[]>([
        { firstName: '', lastName: '', email: '', dietary: 'none', children: false }
    ])

    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState<string | null>(null)
    const [msg, setMsg] = useState<string | null>(null)

    function updateHousehold<K extends keyof HouseholdInput>(k: K, v: HouseholdInput[K]) {
        setHousehold(h => ({ ...h, [k]: v }))
    }

    function updateGuest(idx: number, patch: Partial<GuestInput>) {
        setGuests(arr => arr.map((g, i) => i === idx ? { ...g, ...patch } : g))
    }

    function addGuest() {
        setGuests(arr => [...arr, { firstName: '', lastName: '', email: '', dietary: 'none', children: false }])
    }

    function removeGuest(idx: number) {
        setGuests(arr => arr.length > 1 ? arr.filter((_, i) => i !== idx) : arr)
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true); setErr(null); setMsg(null)

        // Validación mínima
        if (!guests.every(g => g.firstName && g.lastName && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g.email))) {
            setErr('Revisa nombre, apellidos y email de cada invitado.')
            setLoading(false)
            return
        }
        if (!household.street || !household.city || !household.postalCode || !household.country) {
            setErr('Completa la dirección del hogar.')
            setLoading(false)
            return
        }

        const res = await fetch('/api/invite/request-bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ household, guests })
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
            setMsg('¡Perfecto! Enviamos un código a cada invitado.')
            onSent?.(guests.map(g => g.email))
        } else {
            setErr(data?.message || 'No pudimos procesar el formulario. Intenta de nuevo.')
        }
        setLoading(false)
    }

    return (
        <section className="py-12 bg-[#faf6f3]">
            <div className="max-w-3xl mx-auto rounded-2xl p-6 shadow bg-white">
                <h3 className="text-2xl mb-2 text-center">Confirma tus datos para recibir el acceso</h3>
                <p className="text-sm text-center text-[#666] mb-6">
                    Completa la información del hogar y de los invitados. Enviaremos un <strong>código único por email</strong> a cada invitado.
                </p>

                <form onSubmit={submit} className="flex flex-col gap-8">
                    {/* Hogar */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Datos del hogar</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input className="border rounded-xl p-3" placeholder="Calle y número"
                                value={household.street} onChange={e => updateHousehold('street', e.target.value)} />
                            <input className="border rounded-xl p-3" placeholder="Ciudad"
                                value={household.city} onChange={e => updateHousehold('city', e.target.value)} />
                            <input className="border rounded-xl p-3" placeholder="Código postal"
                                value={household.postalCode} onChange={e => updateHousehold('postalCode', e.target.value)} />
                            <input className="border rounded-xl p-3" placeholder="País"
                                value={household.country} onChange={e => updateHousehold('country', e.target.value)} />
                            <input className="border rounded-xl p-3" placeholder="Teléfono de contacto (opcional)"
                                value={household.phone || ''} onChange={e => updateHousehold('phone', e.target.value)} />
                            <div className="grid grid-cols-2 gap-3">
                                <select className="border rounded-xl p-3"
                                    value={household.preferredLanguage}
                                    onChange={e => updateHousehold('preferredLanguage', e.target.value as any)}>
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="it">Italiano</option>
                                </select>
                                <select className="border rounded-xl p-3"
                                    value={household.contactChannel}
                                    onChange={e => updateHousehold('contactChannel', e.target.value as any)}>
                                    <option value="email">Email</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="sms">SMS</option>
                                </select>
                            </div>
                            <textarea className="border rounded-xl p-3 md:col-span-2" placeholder="Notas (accesibilidad, llegada, alojamiento, etc.)"
                                value={household.notes || ''} onChange={e => updateHousehold('notes', e.target.value)} />
                        </div>
                    </div>

                    {/* Invitados */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xl font-semibold">Invitados</h4>
                            <button type="button" onClick={addGuest} className="px-4 py-2 rounded-xl border">
                                + Agregar invitado
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            {guests.map((g, idx) => (
                                <div key={idx} className="border rounded-2xl p-4">
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <input className="border rounded-xl p-3" placeholder="Nombre"
                                            value={g.firstName} onChange={e => updateGuest(idx, { firstName: e.target.value })} />
                                        <input className="border rounded-xl p-3" placeholder="Apellidos"
                                            value={g.lastName} onChange={e => updateGuest(idx, { lastName: e.target.value })} />
                                        <input className="border rounded-xl p-3" placeholder="Correo electrónico"
                                            value={g.email} onChange={e => updateGuest(idx, { email: e.target.value })} />
                                        <input className="border rounded-xl p-3" placeholder="Teléfono (opcional)"
                                            value={g.phone || ''} onChange={e => updateGuest(idx, { phone: e.target.value })} />
                                        <input className="border rounded-xl p-3 md:col-span-2" placeholder="Alergias (si aplica)"
                                            value={g.allergies || ''} onChange={e => updateGuest(idx, { allergies: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-3 md:col-span-2">
                                            <select className="border rounded-xl p-3"
                                                value={g.dietary || 'none'}
                                                onChange={e => updateGuest(idx, { dietary: e.target.value as any })}>
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
                                                <input className="border rounded-xl p-3" placeholder="Especifica la dieta"
                                                    value={g.dietaryOther || ''} onChange={e => updateGuest(idx, { dietaryOther: e.target.value })} />
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-3 md:col-span-2">
                                            <input className="border rounded-xl p-3" placeholder="Necesidades de movilidad / accesibilidad (opcional)"
                                                value={g.mobilityNeeds || ''} onChange={e => updateGuest(idx, { mobilityNeeds: e.target.value })} />
                                            <input className="border rounded-xl p-3" placeholder="Canción que te gustaría oír (opcional)"
                                                value={g.songSuggestion || ''} onChange={e => updateGuest(idx, { songSuggestion: e.target.value })} />
                                        </div>

                                        <label className="flex items-center gap-2 md:col-span-2">
                                            <input type="checkbox" checked={!!g.children}
                                                onChange={e => updateGuest(idx, { children: e.target.checked })} />
                                            ¿Asistirá con niños?
                                        </label>
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
                            {loading ? 'Enviando…' : 'Enviar y recibir códigos'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
