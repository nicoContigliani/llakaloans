export interface ClerkModuleConfig {
    publishableKey: string;
    appearance?: any;
    routes?: {
      signIn?: string;
      signUp?: string;
      userProfile?: string;
    };
  }
  
  export interface ProxyHandlerConfig {
    apiPath: string;
    protectedPaths: string[];
    publicPaths: string[];
  }