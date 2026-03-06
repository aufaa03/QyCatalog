import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function isConfigured() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    return url.startsWith('https://') && url.includes('.supabase.co') && key.length > 20
}

export async function middleware(request: NextRequest) {
    const isLoginPage = request.nextUrl.pathname === '/admin/login'
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

    // If Supabase not configured, allow all /admin access for dev/setup purposes
    if (!isConfigured()) {
        return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    let session = null
    try {
        const { data } = await supabase.auth.getSession()
        session = data.session
    } catch {
        // Auth service unavailable — let request through
        return NextResponse.next({ request })
    }

    // If trying to access admin (not login) without session → redirect to login
    if (isAdminRoute && !isLoginPage && !session) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/admin/login'
        return NextResponse.redirect(redirectUrl)
    }

    // If already logged in and trying to access login page → redirect to dashboard
    if (isLoginPage && session) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/admin'
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
}
