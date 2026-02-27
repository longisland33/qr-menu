import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method; // Metodu buradan götürürük

  // Sadece API rotalarını yoxla
  if (pathname.startsWith('/api/')) {
    
    // 1. İSTİSNA: Müştəri sifariş verəndə (POST /api/orders) bloklama
    if (pathname === '/api/orders' && method === 'POST') {
      return NextResponse.next();
    }

    if (pathname === '/api/notifications' && method === 'POST') {
  return NextResponse.next();
}

    // 2. İSTİSNA: Login cəhdini bloklama (yoxsa heç kim girə bilməz)
    if (pathname === '/api/auth/login') {
      return NextResponse.next();
    }

    // 3. QORUMA: GET-dən başqa hər şeyi (POST, PATCH, DELETE) və 
    // Adminin öz məlumatlarını (GET /api/auth/me) qoru
    if (method !== 'GET' || pathname === '/api/auth/me') {
      // Login API-da adını "token" qoyduğumuz cookie-ni yoxlayırıq
      const token = request.cookies.get('token')?.value;

      if (!token) {
        return NextResponse.json(
          { error: "Yetkisiz giriş! Zəhmət olmasa daxil olun." },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};