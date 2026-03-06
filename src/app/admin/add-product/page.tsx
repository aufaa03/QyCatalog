'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

function formatPriceInput(value: string) {
    const num = value.replace(/\D/g, '')
    return num ? Number(num).toLocaleString('id-ID') : ''
}

export default function AddProductPage() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [affiliateUrl, setAffiliateUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    function handleFileSelect(file: File) {
        if (!file.type.startsWith('image/')) { setError('File harus berupa gambar (JPG, PNG, WEBP)'); return }
        if (file.size > 5 * 1024 * 1024) { setError('Ukuran gambar maksimal 5 MB'); return }
        setError('')
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = (e) => setImagePreview(e.target?.result as string)
        reader.readAsDataURL(file)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault(); setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileSelect(file)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!imageFile) { setError('Upload foto produk terlebih dahulu'); return }
        setLoading(true); setError('')

        const supabase = createClient()
        const ext = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
            .from('products').upload(fileName, imageFile, { cacheControl: '3600', upsert: false })

        if (uploadError) { setError(`Gagal upload gambar: ${uploadError.message}`); setLoading(false); return }

        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
        const rawPrice = Number(price.replace(/\D/g, ''))

        const { error: insertError } = await supabase.from('products').insert({
            name,
            description: description.trim() || null,
            price: rawPrice,
            affiliate_url: affiliateUrl,
            image_url: publicUrl,
        })

        if (insertError) {
            await supabase.storage.from('products').remove([fileName])
            setError(`Gagal menyimpan produk: ${insertError.message}`)
            setLoading(false); return
        }

        router.push('/admin'); router.refresh()
    }

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(124,58,237,0.3)' }}>
                <div className="admin-container" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}>←</button>
                    <div>
                        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>Tambah Produk</h1>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem' }}>Isi detail produk baru</p>
                    </div>
                </div>
            </header>

            {/* Form — two-column on desktop */}
            <div className="admin-container" style={{ padding: 'clamp(20px, 3vw, 48px) 24px 80px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'clamp(16px, 3vw, 40px)',
                        alignItems: 'start',
                    }}>

                        {/* LEFT: Image Upload */}
                        <div>
                            <label className="label" style={{ fontSize: '1rem', marginBottom: '10px' }}>Foto Produk *</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                style={{
                                    border: `2px dashed ${dragOver ? 'var(--color-primary)' : imagePreview ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: dragOver ? '#EDE9FE' : imagePreview ? '#000' : '#fff',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {imagePreview ? (
                                    <>
                                        <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'contain' }} />
                                        <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(124,58,237,0.9)', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            Ganti Foto
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '24px' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📷</div>
                                        <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' }}>Upload Foto Produk</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Drag &amp; drop atau klik untuk pilih</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>JPG, PNG, WEBP · Maks 5 MB</p>
                                    </div>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
                        </div>

                        {/* RIGHT: Form Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label className="label" htmlFor="name">Nama Produk *</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Contoh: Sepatu Nike Air Max 270" required maxLength={200} style={{ fontSize: '1rem', padding: '14px 16px' }} />
                            </div>

                            <div>
                                <label className="label" htmlFor="description">Deskripsi Produk</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field"
                                    placeholder="Tulis deskripsi singkat tentang produk ini... (opsional)"
                                    rows={4}
                                    maxLength={500}
                                    style={{ fontSize: '0.95rem', padding: '14px 16px', resize: 'vertical', minHeight: '100px', fontFamily: 'inherit', lineHeight: '1.5' }}
                                />
                                <p style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)', marginTop: '4px', textAlign: 'right' }}>
                                    {description.length}/500 karakter
                                </p>
                            </div>

                            <div>
                                <label className="label" htmlFor="price">Harga (IDR) *</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontWeight: 600, pointerEvents: 'none' }}>Rp</span>
                                    <input id="price" type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(formatPriceInput(e.target.value))} className="input-field" placeholder="0" required style={{ paddingLeft: '42px', fontSize: '1rem', padding: '14px 16px 14px 42px' }} />
                                </div>
                            </div>

                            <div>
                                <label className="label" htmlFor="affiliateUrl">Link Affiliate *</label>
                                <input id="affiliateUrl" type="url" value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} className="input-field" placeholder="https://shopee.co.id/..." required style={{ fontSize: '1rem', padding: '14px 16px' }} />
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                                    Link ke halaman produk di marketplace (Shopee, Tokopedia, dll)
                                </p>
                            </div>

                            {error && (
                                <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '14px 18px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 500, border: '1px solid #FCA5A5' }}>
                                    ⚠️ {error}
                                </div>
                            )}

                            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '16px', fontSize: '1rem', width: '100%', marginTop: '4px' }}>
                                {loading ? '⏳ Menyimpan...' : '🚀 Publish Produk'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}
