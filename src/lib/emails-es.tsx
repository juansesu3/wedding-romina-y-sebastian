// emails/InviteMagicLink.tsx
import * as React from 'react'

export default function InviteMagicLinkEmailEs({
  firstName,
  link,
}: { firstName: string; link: string }) {
  return (
    <div
      style={{
        fontFamily: 'Lora, Georgia, serif',
        lineHeight: 1.6,
        color: '#4a4a4a',
        backgroundColor: '#faf6f3',
        padding: '32px',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* Encabezado */}
      <h2
        style={{
          marginBottom: '4px',
          fontSize: '24px',
          color: '#bd966e',
          fontWeight: 600,
        }}
      >
        ¡Hola {firstName || 'invitado/a'}!
      </h2>
      <p
        style={{
          marginTop: 0,
          marginBottom: '16px',
          fontSize: '15px',
          color: '#6d6d6d',
        }}
      >
        Qué alegría tenerte con nosotros. Gracias por confirmar tu asistencia.
        Este es tu <strong>enlace personal de acceso</strong> a la página oficial de nuestra boda.
      </p>

      {/* Botón de acceso */}
      <p style={{ textAlign: 'center', margin: '24px 0' }}>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '500',
            backgroundColor: '#d49e7a',
            color: '#fff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          Ver detalles de la boda
        </a>
      </p>

      {/* Descripción */}
      <p style={{ fontSize: '14px', marginBottom: '16px' }}>
        En esta web encontrarás toda la información importante: ubicación, horario,
        recomendaciones, dress code, playlist y más.
      </p>

      {/* Link alternativo */}
      <p style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '24px' }}>
        Si el botón no funciona, copia y pega esta URL en tu navegador:
        <br />
        <span
          style={{
            display: 'inline-block',
            marginTop: '8px',
            padding: '8px',
            backgroundColor: '#f3ece7',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#4a4a4a',
            wordBreak: 'break-all',
          }}
        >
          {link}
        </span>
      </p>

      {/* Footer */}
      <p
        style={{
          marginTop: '32px',
          fontSize: '13px',
          color: '#bd966e',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Con cariño,  
        <br />
        <strong>Romi & Sebas</strong>
      </p>
    </div>
  )
}
