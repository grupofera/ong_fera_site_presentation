import { Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🐾</span> ONG FERA
            </h3>
            <p className="text-sm opacity-90">
              Organização de Defesa Animal dedicada ao bem-estar e proteção dos animais desde 2014.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#sobre" className="opacity-90 hover:opacity-100 transition-opacity">
                  Sobre o Projeto
                </a>
              </li>
              <li>
                <a href="#design" className="opacity-90 hover:opacity-100 transition-opacity">
                  Design
                </a>
              </li>
              <li>
                <a href="#tecnologia" className="opacity-90 hover:opacity-100 transition-opacity">
                  Tecnologia
                </a>
              </li>
              <li>
                <a href="#impacto" className="opacity-90 hover:opacity-100 transition-opacity">
                  Impacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:falecomgrupofera@gmail.com" className="opacity-90 hover:opacity-100 transition-opacity">
                  falecomgrupofera@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="opacity-90">Mogi das Cruzes, SP</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/grupofera.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 hover:opacity-100 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/grupofera/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 hover:opacity-100 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-90">
          <p>© 2026 ONG FERA. Todos os direitos reservados.</p>
          <p className="mt-2 text-xs">Projeto desenvolvido com ❤️ por Manus AI</p>
        </div>
      </div>
    </footer>
  );
}
