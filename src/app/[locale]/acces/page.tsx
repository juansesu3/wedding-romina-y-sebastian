import { verifyGuestToken } from '@/lib/jwt'

export default async function AccessPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token
  if (!token) {
    return (
      <section className="py-12">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
          <h1 className="text-2xl mb-2">Enlace inválido</h1>
          <p className="text-[#666]">No encontramos un token de acceso. Revisa tu correo e intenta de nuevo.</p>
        </div>
      </section>
    )
  }

  try {
    const payload = await verifyGuestToken(token)
    const firstName = payload.firstName || 'Invitado/a'

    // Aquí podrías cargar datos adicionales del invitado desde DB si existiera.
    return (
      <section className="py-12">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
          <h1 className="text-2xl mb-3">¡Hola, {firstName}!</h1>
          <p className="text-[#666] mb-6">
            Bienvenido/a a la página de la boda de Romina & Sebas. Aquí encontrarás toda la información:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Fecha, hora y lugar</li>
            <li>Mapa y transporte</li>
            <li>Dress code</li>
            <li>Programa del día</li>
            <li>Playlist colaborativa</li>
            <li>Detalles de alojamiento</li>
          </ul>

          <div className="mt-8 p-4 rounded-xl bg-[#faf6f3]">
            <h2 className="text-xl mb-2">Tus datos</h2>
            <p><strong>Nombre:</strong> {payload.firstName} {payload.lastName}</p>
            <p><strong>Email:</strong> {payload.email}</p>
            {typeof payload.age !== 'undefined' && <p><strong>Edad:</strong> {payload.age}</p>}
            {typeof payload.isChild !== 'undefined' && <p><strong>Niño/niña:</strong> {payload.isChild ? 'Sí' : 'No'}</p>}
          </div>
        </div>
      </section>
    )
  } catch (e) {
    return (
      <section className="py-12">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
          <h1 className="text-2xl mb-2">Enlace expirado o no válido</h1>
          <p className="text-[#666]">Solicita un nuevo enlace desde la página de invitación.</p>
        </div>
      </section>
    )
  }
}
