import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Product } from '@/types/product'
import ProductGrid from '@/components/ProductGrid'

export const revalidate = 60

export default async function HomePage() {
    let products: Product[] = []

    if (isSupabaseConfigured()) {
        try {
            const supabase = await createClient()
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
            products = (data as Product[]) ?? []
        } catch {
            // show empty catalog if unavailable
        }
    }

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

            {/* ===== STICKY HEADER ===== */}
            <header style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                position: 'sticky', top: 0, zIndex: 100,
                boxShadow: '0 2px 20px rgba(124,58,237,0.3)',
            }}>
                <div className="page-container" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.3rem', flexShrink: 0,
                        }}>✨</div>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                Qy Product List
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 400 }}>
                                Produk pilihan terbaik
                            </p>
                        </div>
                    </div>
                    <span className="badge badge-amber">{products.length} Produk</span>
                </div>
            </header>

            {/* ===== HERO BANNER ===== */}
            <div className="hero-section" style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* decorative blobs */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)' }} />
                <div style={{ position: 'absolute', top: '30%', right: '20%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                <div className="page-container" style={{ position: 'relative' }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🔥 Rekomendasi Terpercaya
                    </p>
                    <h2 className="hero-title" style={{ color: '#fff', marginBottom: '16px' }}>
                        Temukan Produk Terbaik<br />
                        <span style={{ color: '#FCD34D' }}>Harga Terjangkau</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', maxWidth: '560px', lineHeight: 1.6 }}>
                        Koleksi produk pilihan langsung dari marketplace terpercaya. Klik &amp; beli dengan mudah!
                    </p>
                </div>
            </div>

            {/* ===== CATALOG ===== */}
            <div className="catalog-panel">
                <div className="page-container">
                    <div style={{
                        background: '#fff',
                        borderRadius: '20px 20px 0 0',
                        padding: 'clamp(16px, 3vw, 32px) clamp(16px, 3vw, 32px) 0',
                        boxShadow: '0 -4px 24px rgba(124,58,237,0.08)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.3rem' }}>🛍️</span>
                                <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, color: 'var(--color-text)' }}>
                                    Semua Produk
                                </h2>
                            </div>
                            <span className="badge badge-purple">{products.length} item</span>
                        </div>
                    </div>

                    <div style={{
                        background: '#fff',
                        padding: 'clamp(12px, 2vw, 24px) clamp(16px, 3vw, 32px) clamp(32px, 5vw, 60px)',
                        borderRadius: '0 0 20px 20px',
                        boxShadow: '0 4px 24px rgba(124,58,237,0.08)',
                    }}>
                        <ProductGrid products={products} />
                    </div>
                </div>
            </div>

            {/* ===== FOOTER ===== */}
            <footer style={{
                textAlign: 'center', padding: '32px 20px',
                color: 'var(--color-text-muted)', fontSize: '0.85rem',
                borderTop: '1px solid var(--color-border)',
            }}>
                <p>© 2025 Qy Product List · Made with 💜</p>
            </footer>
        </main>
    )
}
