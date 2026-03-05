// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // Aqui você pode adicionar lógicas extras de roteamento se precisar no futuro
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                // Arquitetura defensiva: Só entra no /dashboard quem tem token E é ADMIN.
                // Se retornar false, o Next-Auth redireciona automaticamente para a página de login.
                if (req.nextUrl.pathname.startsWith("/dashboard")) {
                    return token?.role === "ADMIN";
                }
                return !!token;
            },
        },
    }
);

// Define quais rotas o middleware deve vigiar
export const config = {
    matcher: ["/dashboard/:path*"],
};