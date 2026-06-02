import { ArrowRight, Code2, Palette, Zap, Users, Award } from 'lucide-react';

/**
 * Home Page - ONG FERA Project Presentation
 * 
 * Design Philosophy: Minimalismo Corporativo com Foco em Clareza
 * - Hierarquia clara através de tipografia e espaçamento
 * - Verde-musgo (#4a7c59) como cor primária
 * - Laranja-coral (#ff6b35) para CTAs
 * - Alternância entre full-width e container-width
 */

export default function Home() {
  const designPrinciples = [
    {
      icon: Palette,
      title: 'Hierarquia Clara',
      description: 'Guia visitantes naturalmente pela jornada de doação/parceria através de tipografia e espaçamento bem definidos.',
    },
    {
      icon: Award,
      title: 'Autenticidade',
      description: 'Fotos reais de animais resgatados como coração do design, criando conexão emocional genuína.',
    },
    {
      icon: Zap,
      title: 'Espaço Respeitoso',
      description: 'Whitespace generoso para refletir dignidade e permitir que o conteúdo respire.',
    },
    {
      icon: Users,
      title: 'Interatividade Fluida',
      description: 'Transições suaves e hover effects que tornam a experiência agradável e responsiva.',
    },
  ];

  const techStack = [
    { name: 'React 19', version: 'Latest', category: 'Framework' },
    { name: 'TypeScript', version: '5.6.3', category: 'Language' },
    { name: 'Tailwind CSS 4', version: 'Latest', category: 'Styling' },
    { name: 'shadcn/ui', version: 'Latest', category: 'Components' },
    { name: 'Wouter', version: '3.3.5', category: 'Routing' },
    { name: 'Lucide React', version: '0.453.0', category: 'Icons' },
  ];

  const features = [
    { title: 'Responsivo', description: 'Mobile-first design que funciona perfeitamente em todos os dispositivos' },
    { title: 'Acessível', description: 'Contraste adequado, navegação por teclado e ARIA labels' },
    { title: 'Otimizado', description: 'Imagens otimizadas e carregamento rápido' },
    { title: 'SEO-friendly', description: 'Meta tags, estrutura semântica e URLs amigáveis' },
  ];

  const sections = [
    { name: 'Header', description: 'Navegação responsiva com logo e menu mobile' },
    { name: 'Hero Section', description: 'Layout assimétrico com imagem e CTAs destacados' },
    { name: 'Sobre', description: 'Descrição da missão da ONG' },
    { name: 'Como Ajudar', description: '4 cards interativos com opções de ação' },
    { name: 'Impacto', description: 'Estatísticas em fundo verde-musgo' },
    { name: 'Adoção', description: 'Seção com benefícios e CTA' },
    { name: 'Doações', description: '4 métodos de doação em cards' },
    { name: 'Blog', description: '3 posts exemplo com CTA' },
    { name: 'CTA Final', description: 'Chamada para ação em verde-musgo' },
    { name: 'Footer', description: 'Contatos e redes sociais' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-white to-secondary">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="mb-6 text-6xl">🐾</div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Redesign do Site ONG FERA
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Uma documentação completa do projeto de transformação digital da Organização de Defesa Animal, 
              desde o conceito até a implementação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#design" className="cta-primary inline-flex items-center justify-center gap-2">
                Explorar Design <ArrowRight size={20} />
              </a>
              <a href="#tecnologia" className="cta-secondary inline-flex items-center justify-center gap-2">
                Ver Tecnologia <Code2 size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="py-12 bg-white">
        <div className="container">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416812512/oZ4kpqujbtBAQ2ErnrqnbZ/hero_project_showcase-Vtbmduonn456u4R6rDYiQF.webp"
            alt="ONG FERA Project Showcase"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-primary mb-6">Sobre o Projeto</h2>
            <div className="space-y-4 text-foreground">
              <p>
                O projeto de redesign do site da <strong>ONG FERA</strong> (Organização de Defesa Animal) 
                foi desenvolvido com o objetivo de criar uma presença digital mais atraente e eficaz para 
                converter visitantes em parceiros e doadores.
              </p>
              <p>
                Baseado no site original (https://ongfera.org.br/), o novo design implementa uma abordagem 
                moderna e humanista que coloca a conexão emocional no centro da experiência do usuário.
              </p>
              <p>
                A ONG FERA, localizada em Mogi das Cruzes, SP, atua desde 2014 na defesa dos direitos dos 
                animais, com foco em resgate, cuidados veterinários e adoção responsável.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Design Section */}
      <section id="design" className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="text-primary mb-12 text-center">Filosofia de Design</h2>

          {/* Design Philosophy Image */}
          <div className="mb-12">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416812512/oZ4kpqujbtBAQ2ErnrqnbZ/design_philosophy_visual-2gxc5orYh2r5j4ZBur7TBm.webp"
              alt="Design Philosophy"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Color Palette */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Paleta de Cores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-highlight">
                <div className="w-full h-24 bg-primary rounded-lg mb-4"></div>
                <h4 className="font-semibold text-foreground mb-2">Verde-Musgo</h4>
                <p className="text-sm text-muted-foreground">#4a7c59</p>
                <p className="text-xs text-muted-foreground mt-2">Transmite confiança e conexão com a natureza</p>
              </div>
              <div className="card-highlight">
                <div className="w-full h-24 bg-accent rounded-lg mb-4"></div>
                <h4 className="font-semibold text-foreground mb-2">Laranja-Coral</h4>
                <p className="text-sm text-muted-foreground">#ff6b35</p>
                <p className="text-xs text-muted-foreground mt-2">Cria urgência compassiva nos CTAs</p>
              </div>
              <div className="card-highlight">
                <div className="w-full h-24 bg-secondary rounded-lg mb-4 border border-border"></div>
                <h4 className="font-semibold text-foreground mb-2">Cinza Claro</h4>
                <p className="text-sm text-muted-foreground">#f5f5f5</p>
                <p className="text-xs text-muted-foreground mt-2">Clareza e espaço respeitoso</p>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Tipografia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-highlight">
                <h4 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'Poppins' }}>
                  Poppins
                </h4>
                <p className="text-sm text-muted-foreground mb-3">Para títulos e destaques</p>
                <p className="text-xs text-muted-foreground">Weights: 400, 500, 600, 700</p>
              </div>
              <div className="card-highlight">
                <h4 className="text-2xl font-semibold text-primary mb-2" style={{ fontFamily: 'Inter' }}>
                  Inter
                </h4>
                <p className="text-sm text-muted-foreground mb-3">Para corpo de texto</p>
                <p className="text-xs text-muted-foreground">Weights: 400, 500, 600, 700</p>
              </div>
            </div>
          </div>

          {/* Design Principles */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-foreground">Princípios de Design</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {designPrinciples.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div key={principle.title} className="card-highlight">
                    <Icon className="text-primary mb-4" size={32} />
                    <h4 className="font-semibold text-foreground mb-2">{principle.title}</h4>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sections Overview */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="text-primary mb-12 text-center">10 Seções Implementadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <div key={section.name} className="card-highlight">
                <h4 className="font-semibold text-foreground mb-2">{section.name}</h4>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tecnologia" className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="text-primary mb-12 text-center">Stack Técnico</h2>

          {/* Tech Stack Image */}
          <div className="mb-12">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416812512/oZ4kpqujbtBAQ2ErnrqnbZ/tech_stack_visual-Jhsjm6FauQRzA2EF4sipXG.webp"
              alt="Tech Stack"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Tech Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {techStack.map((tech) => (
              <div key={tech.name} className="card-highlight">
                <span className="badge-tech mb-3">{tech.category}</span>
                <h4 className="font-semibold text-foreground mb-1">{tech.name}</h4>
                <p className="text-xs text-muted-foreground">v{tech.version}</p>
              </div>
            ))}
          </div>

          {/* Framework Info */}
          <div className="bg-primary text-primary-foreground p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Por que React + Tailwind?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span><strong>React 19:</strong> Framework moderno com renderização eficiente e componentes reutilizáveis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span><strong>TypeScript:</strong> Tipagem estática para código mais seguro e manutenível</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span><strong>Tailwind CSS 4:</strong> Utility-first CSS para desenvolvimento rápido e consistente</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span><strong>shadcn/ui:</strong> Componentes de alta qualidade construídos sobre Radix UI</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="impacto" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="text-primary mb-12 text-center">Funcionalidades Implementadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-highlight">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-accent text-xl">✓</span>
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <h2 className="text-primary mb-12 text-center">Cronograma do Projeto</h2>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663416812512/oZ4kpqujbtBAQ2ErnrqnbZ/project_timeline-5Fzgi5Wjtha6g9FxY3it82.webp"
            alt="Project Timeline"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* ONG Info Section */}
      <section id="contato" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="text-primary mb-12 text-center">Sobre a ONG FERA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="card-highlight">
              <h4 className="font-semibold text-foreground mb-4">Informações de Contato</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><strong>Email:</strong> falecomgrupofera@gmail.com</li>
                <li><strong>Localização:</strong> Mogi das Cruzes, SP</li>
                <li><strong>Fundação:</strong> 2014</li>
              </ul>
            </div>
            <div className="card-highlight">
              <h4 className="font-semibold text-foreground mb-4">Formas de Doação</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><strong>PIX (CNPJ):</strong> 29.290.977/0001-72</li>
                <li><strong>Banco do Brasil:</strong> Ag: 3568-8 | CC: 33127-9</li>
                <li><strong>Voluntariado:</strong> Dedique seu tempo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-white mb-6">Pronto para Conhecer o Site?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Visite o site completo da ONG FERA e conheça todas as funcionalidades, 
            design responsivo e chamadas para ação estratégicas.
          </p>
          <a
            href="https://ongfera.org.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Visitar Site ONG FERA <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </div>
  );
}
