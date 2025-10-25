import * as React from 'react'

export function InviteMagicLinkEmail({
  firstName, link,
}: { firstName: string; link: string }) {
  return (
    <div style={{ fontFamily: 'Lora, Georgia, serif', lineHeight: 1.6 }}>
      <h2 style={{ margin: '0 0 8px' }}>¡Hola {firstName || 'invitado/a'}!</h2>
      <p>Gracias por confirmar tu asistencia. Aquí tienes tu enlace de acceso personal:</p>
      <p>
        <a href={link} target="_blank" rel="noreferrer" style={{
          display: 'inline-block', padding: '10px 16px', borderRadius: 8,
          textDecoration: 'none', background: '#d49e7a', color: '#fff'
        }}>
          Abrir página de la boda
        </a>
      </p>
      <p>Este enlace te llevará a la página con todos los detalles.</p>
      <p style={{ fontSize: 12, color: '#666' }}>
        Si el botón no funciona, copia y pega esta URL en tu navegador: <br />
        <span>{link}</span>
      </p>
      <p>Con cariño, Romina & Sebas</p>
    </div>
  )
}
