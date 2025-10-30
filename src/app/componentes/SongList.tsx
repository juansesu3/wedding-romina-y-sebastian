'use client'

import { useEffect, useState } from 'react'

type Song = {
    _id: string
    songName: string
    artist: string
    personName: string
    createdAt?: string
}

export default function SongList() {
    const [items, setItems] = useState<Song[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchSongs() {
        try {
            setLoading(true)
            const res = await fetch('/api/songs', { cache: 'no-store' })
            const data = await res.json()
            setItems(data.items || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSongs()
    }, [])

    if (loading) return <p className="text-center text-sm text-gray-500">Cargando canciones…</p>

    return (
        <div className="mt-6 ">
            <h4 className="text-center text-lg font-semibold">Sugerencias de canciones</h4>
            {items.length === 0 ? (
                <p className="text-center text-sm text-gray-500 mt-2">Aún no hay sugerencias. ¡Sé el primero!</p>
            ) : (
                <ul className="mt-3 grid gap-2">
                    {items.map((s) => (
                        <li
                            key={s._id}
                            className="rounded-xl border px-4 py-3 flex items-center justify-between "
                        >
                            <div className=''>
                                <p className="font-medium">{s.songName} <span className="text-gray-500">— {s.artist}</span></p>
                                <p className="text-xs text-gray-500">Propuesto por {s.personName}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
