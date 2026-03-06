import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Qy Product List',
    description: 'Katalog produk pilihan terbaik dengan harga terjangkau',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id">
            <body>{children}</body>
        </html>
    )
}
