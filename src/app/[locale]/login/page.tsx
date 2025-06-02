'use client';

import FadeInOnScroll from '@/app/componentes/FadeScroll';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage = () => {
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Código incorrecto');
                setLoading(false);
                return;
            }

            // ✅ Redirigir al home si fue exitoso
            router.push('/');
        } catch (err) {
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url('/assets/fondo-boda-3.webp')` }}
        >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <FadeInOnScroll>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#d0b7a487] p-6 rounded shadow-lg max-w-md w-full flex flex-col justify-center items-center gap-4"
                    >
                        <h3 className="text-white text-4xl text-center font-extrabold">
                            ¡Nos encantaría que seas parte de este día tan especial!
                        </h3>
                        <p className="font-bold text-2xl  text-center">
                            Ingresa tu código para continuar
                        </p>
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="Código de invitación"
                            className="w-full border-none rounded-md p-2 bg-white text-black"
                            required
                        />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? 'Validando...' : 'Ver invitación'}
                        </button>
                    </form>
                </FadeInOnScroll>
            </div>
        </div>
    );
};

export default LoginPage;
