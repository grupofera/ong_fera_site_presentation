import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="text-5xl">🐾</div>
          </div>
          <CardTitle className="text-3xl">ONG FERA</CardTitle>
          <CardDescription className="text-base">
            Sistema de Gerenciamento de Animais
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3 text-center text-sm text-muted-foreground">
            <p>
              Bem-vindo ao sistema de gerenciamento da ONG FERA. Faça login para acessar o dashboard e gerenciar animais, adoções, doações e voluntários.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              disabled={loading}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                "Fazer Login com Manus"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Você será redirecionado para a página de autenticação da Manus
            </p>
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Funcionalidades:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Gerenciar animais resgatados</li>
                <li>Registrar adoções</li>
                <li>Controlar doações</li>
                <li>Gerenciar voluntários</li>
                <li>Projeto especial "Animais Iluminados"</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t text-xs text-center text-muted-foreground">
            <p>
              Acesso restrito a membros da ONG FERA. Se você não tem uma conta, entre em contato com o administrador.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
