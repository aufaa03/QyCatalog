'use client'

import { Product } from '@/types/product'
import ProductCard from './ProductCard'

function SkeletonCard() {
    return (
        <div className="card" style={{ overflow: 'hidden' }}>
            <div className="skeleton" style={{ width: '100%', paddingBottom: '100%' }} />
            <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ height: '16px', borderRadius: '6px' }} />
                <div className="skeleton" style={{ height: '16px', borderRadius: '6px', width: '70%' }} />
                <div className="skeleton" style={{ height: '20px', borderRadius: '6px', width: '55%', marginTop: '4px' }} />
                <div className="skeleton" style={{ height: '40px', borderRadius: '10px', marginTop: '6px' }} />
            </div>
        </div>
    )
}

export function ProductGridSkeleton() {
    return (
        <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

export default function ProductGrid({ products }: { products: Product[] }) {
    if (products.length === 0) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px 20px',
                    gap: '16px',
                    color: 'var(--color-text-muted)',
                }}
            >
                <div style={{ fontSize: '4rem' }}>🛒</div>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                    Belum ada produk
                </p>
                <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                    Produk akan segera tersedia. Nantikan update kami!
                </p>
            </div>
        )
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
