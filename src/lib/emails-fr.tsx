// emails/InviteMagicLink.tsx
import * as React from 'react'

export default function InviteMagicLinkEmailFr({
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
      {/* En-tête */}
      <h2
        style={{
          marginBottom: '4px',
          fontSize: '24px',
          color: '#bd966e',
          fontWeight: 600,
        }}
      >
        Bonjour {firstName || 'invité(e)'} !
      </h2>
      <p
        style={{
          marginTop: 0,
          marginBottom: '16px',
          fontSize: '15px',
          color: '#6d6d6d',
        }}
      >
        Quelle joie de t’avoir parmi nous ! Merci d’avoir confirmé ta présence.  
        Voici ton <strong>lien personnel d’accès</strong> au site officiel de notre mariage.
      </p>

      {/* Bouton d’accès */}
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
          Voir les détails du mariage
        </a>
      </p>

      {/* Description */}
      <p style={{ fontSize: '14px', marginBottom: '16px' }}>
        Sur ce site, tu trouveras toutes les informations importantes : lieu, horaire, 
        recommandations, dress code, playlist et bien plus encore.
      </p>

      {/* Lien alternatif */}
      <p style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '24px' }}>
        Si le bouton ne fonctionne pas, copie et colle ce lien dans ton navigateur :
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

      {/* Pied de page */}
      <p
        style={{
          marginTop: '32px',
          fontSize: '13px',
          color: '#bd966e',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Avec tout notre amour,  
        <br />
        <strong>Romi & Sebas</strong>
      </p>
    </div>
  )
}
