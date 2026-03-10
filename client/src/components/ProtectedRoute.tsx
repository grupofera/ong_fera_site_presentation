import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-5xl">🚫</div>
          <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página. Entre em contato com o administrador.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
