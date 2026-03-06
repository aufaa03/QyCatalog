'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/product'

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [user, setUser] = useState<{ email?: string } | null>(null)
    const router = useRouter()

    useEffect(() => {
        let supabase: ReturnType<typeof createClient> | null = null
        try { supabase = createClient() } catch { setLoading(false); return }

        supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null)).catch(() => { })
        fetchProducts(supabase)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function fetchProducts(supabase: ReturnType<typeof createClient>) {
        setLoading(true)
        try {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
            setProducts((data as Product[]) ?? [])
        } catch { setProducts([]) }
        setLoading(false)
    }

    async function handleDelete(id: string, imageUrl: string) {
        if (!confirm('Hapus produk ini?')) return
        setDeleting(id)
        try {
            const supabase = createClient()
            const imagePath = imageUrl.split('/products/')[1]
            if (imagePath) await supabase.storage.from('products').remove([imagePath])
            await supabase.from('products').delete().eq('id', id)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch { alert('Gagal menghapus produk.') }
        setDeleting(null)
    }

    async function handleLogout() {
        try { const s = createClient(); await s.auth.signOut() } catch { /* ignore */ }
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

            {/* ===== HEADER ===== */}
            <header style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                position: 'sticky', top: 0, zIndex: 100,
                boxShadow: '0 2px 20px rgba(124,58,237,0.3)',
            }}>
                <div className="admin-container" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.2 }}>
                            ✨ Qy Product List
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>Admin Dashboard</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', display: 'none' }} className="md-show">
                            {user?.email}
                        </span>
                        <button
                            className="btn-ghost"
                            onClick={handleLogout}
                            style={{ padding: '8px 18px', fontSize: '0.85rem', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.1)' }}
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== BODY ===== */}
            <div className="admin-container" style={{ padding: '28px 24px 120px' }}>

                {/* Welcome + Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '28px' }}>
                    <div className="card" style={{
                        padding: '24px 28px',
                        background: 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)',
                        border: '1.5px solid #C4B5FD',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                    }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px' }}>
                                Selamat datang kembali 👋
                            </p>
                            <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: 600 }}>
                                {user?.email ?? '—'}
                            </p>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => router.push('/admin/add-product')}
                            style={{ padding: '10px 22px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                        >
                            + Tambah Produk
                        </button>
                    </div>

                    <div className="stats-grid">
                        {[
                            { label: 'Total Produk', value: loading ? '—' : products.length, color: 'var(--color-primary)' },
                            { label: 'Produk Aktif', value: loading ? '—' : products.length, color: 'var(--color-accent)' },
                            { label: 'Bulan Ini', value: loading ? '—' : products.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length, color: '#10B981' },
                            {
                                label: 'Minggu Ini', value: loading ? '—' : products.filter(p => {
                                    const d = new Date(p.created_at); const now = new Date();
                                    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
                                }).length, color: '#3B82F6'
                            },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="card" style={{ padding: '20px 24px', textAlign: 'center' }}>
                                <p style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color, lineHeight: 1 }}>{String(value)}</p>
                                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product List */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)' }}>
                        Daftar Produk
                    </h2>
                    <span className="badge badge-purple">{products.length} item</span>
                </div>

                {loading ? (
                    <div className="admin-product-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton" style={{ height: '96px', borderRadius: '16px' }} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 20px',
                        color: 'var(--color-text-muted)', background: '#fff',
                        borderRadius: '16px', border: '2px dashed var(--color-border)',
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📦</div>
                        <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px', fontSize: '1.1rem' }}>Belum ada produk</p>
                        <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Mulai tambahkan produk pertamamu!</p>
                        <button className="btn-primary" onClick={() => router.push('/admin/add-product')} style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                            + Tambah Produk
                        </button>
                    </div>
                ) : (
                    <div className="admin-product-grid">
                        {products.map(product => (
                            <div key={product.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px' }}>
                                {/* Thumbnail */}
                                <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
                                    <Image src={product.image_url} alt={product.name} fill sizes="64px" style={{ objectFit: 'cover' }} />
                                </div>
                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {product.name}
                                    </p>
                                    {product.description && (
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                                            {product.description}
                                        </p>
                                    )}
                                    <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem', marginTop: '2px' }}>
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                    <button className="btn-ghost" onClick={() => router.push(`/admin/edit-product/${product.id}`)} style={{ padding: '7px 12px', fontSize: '0.8rem' }}>
                                        ✏️
                                    </button>
                                    <button className="btn-danger" onClick={() => handleDelete(product.id, product.image_url)} disabled={deleting === product.id} style={{ padding: '7px 12px', fontSize: '0.8rem', opacity: deleting === product.id ? 0.6 : 1 }}>
                                        {deleting === product.id ? '...' : '🗑️'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== FAB (mobile) ===== */}
            <button
                className="btn-primary"
                onClick={() => router.push('/admin/add-product')}
                style={{ position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', fontSize: '1.6rem', padding: 0, boxShadow: '0 8px 24px rgba(124,58,237,0.4)', zIndex: 200 }}
                title="Tambah Produk"
            >
                +
            </button>
        </main>
    )
}
