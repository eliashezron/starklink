// src/app/middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req:any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token && pathname === '/home') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
