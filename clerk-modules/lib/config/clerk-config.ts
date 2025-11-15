export const clerkConfig = {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    afterSignInUrl: '/dashboard',
    afterSignUpUrl: '/dashboard',
    afterSignOutUrl: '/',
  } as const;
  
  export const clerkAppearance = {
    elements: {
      rootBox: "mx-auto my-8",
      card: "bg-white shadow-xl rounded-2xl border border-gray-100",
      headerTitle: "text-3xl font-bold text-gray-900",
      headerSubtitle: "text-gray-600 text-lg",
      socialButtonsBlockButton: 
        "border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200",
      formButtonPrimary: 
        "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200",
      formFieldInput: 
        "border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-3 px-4 transition-all duration-200",
      footerActionLink: 
        "text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200",
      formFieldLabel: "text-gray-700 font-medium",
      identityPreviewEditButton: "text-blue-600 hover:text-blue-800",
      userButtonBox: "shadow-lg rounded-full",
    },
    variables: {
      colorPrimary: '#2563eb',
      colorText: '#1f2937',
      colorTextSecondary: '#6b7280',
      colorBackground: '#ffffff',
      colorInputBackground: '#ffffff',
      colorInputText: '#1f2937',
    },
  };