import { proxyConfig } from "../lib/config/proxy-config";

export class ProxyUtils {
  static isProtectedPath(pathname: string): boolean {
    return proxyConfig.protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
  }

  static isPublicPath(pathname: string): boolean {
    return proxyConfig.publicRoutes.some(route => 
      pathname.startsWith(route)
    );
  }

  static shouldHandleAuth(pathname: string): boolean {
    return pathname.startsWith(proxyConfig.apiRoutes.auth);
  }

  static getRedirectPath(authState: boolean, currentPath: string): string | null {
    if (!authState && this.isProtectedPath(currentPath)) {
      return proxyConfig.routes.signIn;
    }
    
    if (authState && (currentPath === proxyConfig.routes.signIn || currentPath === proxyConfig.routes.signUp)) {
      return proxyConfig.routes.afterSignIn;
    }
    
    return null;
  }
}