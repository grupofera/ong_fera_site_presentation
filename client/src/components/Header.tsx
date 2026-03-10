import { useState } from 'react';
import { Menu, X, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();

  const navItems = [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Design', href: '#design' },
    { label: 'Tecnologia', href: '#tecnologia' },
    { label: 'Impacto', href: '#impacto' },
    { label: 'Contato', href: '#contato' },
  ];

  const dashboardItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Animais', href: '/animais' },
    { label: 'Animais Iluminados', href: '/animais-iluminados' },
    { label: 'Adoções', href: '/adocoes' },
    { label: 'Doações', href: '/doacoes' },
    { label: 'Voluntários', href: '/voluntarios' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-2xl font-bold text-primary">🐾</div>
          <div>
            <h1 className="text-xl font-bold text-primary">ONG FERA</h1>
            <p className="text-xs text-muted-foreground">Projeto de Redesign</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {!isAuthenticated ? (
            navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </a>
            ))
          ) : (
            dashboardItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))
          )}
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="text-sm text-muted-foreground">
                {user?.name}
              </div>
              <Button
                onClick={handleLogout}
                disabled={loading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut size={16} />
                Sair
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-2">
                <LogIn size={16} />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-secondary">
          <div className="container py-4 flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full gap-2">
                    <LogIn size={16} />
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {dashboardItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Conectado como: {user?.name}
                  </p>
                  <Button
                    onClick={handleLogout}
                    disabled={loading}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <LogOut size={16} />
                    Sair
                  </Button>
                </div>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
