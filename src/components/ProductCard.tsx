'use client'

import Image from 'next/image'
import { Product } from '@/types/product'

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price)
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <article className="card fade-in-up" style={{ animationDelay: '0.05s', display: 'flex', flexDirection: 'column' }}>
            {/* Product Image */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '100%',
                    background: '#F3F4F6',
                    overflow: 'hidden',
                }}
            >
                <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 hover:scale-110"
                />
            </div>

            {/* Product Info */}
            <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3
                    style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        lineHeight: '1.4',
                        marginBottom: '6px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {product.name}
                </h3>

                {product.description && (
                    <p
                        style={{
                            fontSize: '0.78rem',
                            color: 'var(--color-text-muted)',
                            lineHeight: '1.5',
                            marginBottom: '10px',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {product.description}
                    </p>
                )}

                <p
                    style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        marginBottom: '14px',
                        marginTop: 'auto',
                    }}
                >
                    {formatPrice(product.price)}
                </p>

                <a
                    href={product.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    style={{ display: 'block', textDecoration: 'none' }}
                >
                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '10px 16px', fontSize: '0.875rem' }}
                    >
                        🛍️ Beli Sekarang
                    </button>
                </a>
            </div>
        </article>
    )
}
