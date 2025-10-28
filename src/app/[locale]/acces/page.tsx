// OPTIONAL: keep a tiny UI page (SSR) for direct visits
// app/[locale]/acces/page.tsx
export const metadata = { title: 'Acceso', description: 'Valida tu enlace de acceso' }


export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
const sp = await searchParams
const token = sp?.token || ''
return (
<main className="min-h-dvh grid place-items-center px-6 py-16">
<div className="max-w-lg text-center">
<h1 className="text-2xl font-semibold mb-2">Acceso</h1>
{token ? (
<p className="text-muted-foreground">Validando tu enlace…</p>
) : (
<>
<p className="text-muted-foreground mb-6">Falta el token de acceso.</p>
<a href="./reenvio" className="inline-flex rounded-xl border px-4 py-2">Solicitar nuevo enlace</a>
</>
)}
</div>
<script dangerouslySetInnerHTML={{ __html: `if (location.search.includes('token=')) { /* noop (route.ts will handle on full navigation) */ }` }} />
</main>
)
}