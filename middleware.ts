import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/login(.*)',
    '/register(.*)', 
    '/reset-password(.*)',
    '/api/webhooks/clerk(.*)',
    
]);

export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) {
        return;
    }
    
    const { userId } = await auth();
    
    if (!userId) {
        // Redirigir al login si no está autenticado
        const signInUrl = new URL('/login', req.url);
        return NextResponse.redirect(signInUrl);
    }
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};