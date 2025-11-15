export const proxyConfig = {
    routes: {
      signIn: '/sign-in',
      signUp: '/sign-up',
      userProfile: '/user-profile',
      afterSignIn: '/dashboard',
      afterSignUp: '/dashboard',
      afterSignOut: '/',
    },
    apiRoutes: {
      auth: '/api/auth',
      webhooks: '/api/webhooks/clerk',
    },
    protectedRoutes: [
      '/dashboard',
      '/user-profile',
      '/api/protected',
    ],
    publicRoutes: [
      '/',
      '/api/public',
      '/sign-in',
      '/sign-up',
    ],
  } as const;