
import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth?.token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    
    // Se o usuário está autenticado e tenta acessar a página de login,
    // redirecionar para o dashboard
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Se o usuário não está autenticado e tenta acessar uma rota protegida,
    // redirecionar para login
    if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }: { token: any }) => {
        // Permitir que o middleware decida o redirecionamento
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
