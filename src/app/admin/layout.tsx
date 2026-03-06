import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin — Qy Product List',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
