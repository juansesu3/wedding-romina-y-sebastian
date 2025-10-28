// app/[locale]/invitacion/page.tsx — Server Component (wrapper)
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyGuestToken, type GuestTokenPayload } from '@/lib/jwt'
import InvitacionClient from '@/app/componentes/InitationClient'

export default async function InvitacionPage() {
  const c = await cookies()
  const token = c.get('guest_token')?.value
  if (!token) redirect('../acces')

  const res = await verifyGuestToken(token)
  if (!res.ok) redirect('../acces')

  const p = res.payload as GuestTokenPayload
  const images = [
    'https://my-page-negiupp.s3.amazonaws.com/1747830525049.jpeg',
    'https://my-page-negiupp.s3.amazonaws.com/1746726548042.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1747830445863.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1747830497567.jpeg',
    'https://my-page-negiupp.s3.amazonaws.com/1747830505363.jpeg',
    'https://my-page-negiupp.s3.amazonaws.com/1746726537861.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1747830435565.JPG',
    'https://my-page-negiupp.s3.amazonaws.com/1747830431708.JPG',
  ]

  return <InvitacionClient firstName={p.firstName ?? 'invitado/a'} images={images} />
}
