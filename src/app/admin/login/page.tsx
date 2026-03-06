'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const supabase = createClient()
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            setError('Email atau password salah. Coba lagi.')
            setLoading(false)
        } else {
            router.push('/admin')
            router.refresh()
        }
    }

    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background blobs */}
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)' }} />

            <div
                className="glass fade-in-up"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '24px',
                    padding: '40px 32px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            margin: '0 auto 16px',
                            boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                        }}
                    >
                        ✨
                    </div>
                    <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-text)', marginBottom: '4px' }}>
                        Qy Product List
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Admin Panel</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="admin@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                background: '#FEF2F2',
                                color: '#DC2626',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                border: '1px solid #FCA5A5',
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            padding: '14px',
                            fontSize: '1rem',
                            marginTop: '4px',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? '⏳ Loading...' : '🔐 Masuk'}
                    </button>
                </form>
            </div>
        </main>
    )
}
