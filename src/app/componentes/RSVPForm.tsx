'use client';

import { useEffect, useState } from 'react';
import { Lora } from 'next/font/google';
import { useTranslations } from 'next-intl';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-lora',
});

const LOCAL_KEY = 'wedding-rsvp-no';
const LOCAL_YES_KEY = 'rsvp:sent';

export default function RSVPForm() {
  const t = useTranslations('first_page.form-confirmation.confirmed-messages')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // al montar, revisar si ya respondió en este navegador
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // si ya dijo que sí, también mostramos "ya registrado"
    const yes = window.localStorage.getItem(LOCAL_YES_KEY);
    if (yes) {
      setDone(true);
      return;
    }

    const saved = window.localStorage.getItem(LOCAL_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.done) {
          setDone(true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          status: 'no',
          message,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo enviar la confirmación');
      }

      setDone(true);
      setName('');
      setEmail('');
      setMessage('');

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          LOCAL_KEY,
          JSON.stringify({
            done: true,
            name,
            email,
            ts: Date.now(),
          })
        );
      }
    } catch (err: unknown) {
      // refinamos el tipo en vez de usar "any"
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <></>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white/70 border border-[#d0b7a4]/40 rounded-xl p-6 max-w-md mx-auto mr-2 ml-2 mt-10 flex flex-col gap-4 ${lora.variable} font-[family-name:var(--font-lora)]`}
    >
      <h3 className="text-xl text-center">{t('no.form.title')}</h3>
      <p className="text-sm text-gray-600 text-center">{t('no.form.sub')}</p>

      <label className="flex flex-col gap-1 text-sm">
        {t('no.form.inputs.name')}
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white/80"
          placeholder={t('no.form.inputs.placeholder')}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        {t('no.form.inputs.email')}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="border rounded-lg px-3 py-2 bg-white/80"
          placeholder={t('no.form.inputs.placeholder-email')}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        {t('no.form.inputs.message')}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white/80 min-h-[90px]"
          placeholder={t('no.form.inputs.placeholder-message')}
        />
      </label>

      {error && <p className="text-red-500 text-sm">{t('no.form.inputs.btn.error')}</p>}

      <button type="submit" disabled={sending} className="btn-primary disabled:opacity-60">
        {sending ? t('no.form.inputs.btn.sending') : t('no.form.inputs.btn.text')}
      </button>
    </form>
  );
}
