import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import TrustHeroSection from "@/components/ui/glassmorphism-trust-hero";
import AboutSparklesSection from "@/components/ui/about-sparkles-section";
import { FooterSection } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-black scroll-smooth">
      {/* Secção inicial do Hero (Locações e Mapeamento) */}
      <section id="plataforma">
        <ResponsiveHeroBanner />
      </section>

      {/* Secção de Confiança e Dados Inteligentes (Trust) */}
      <section id="inventario">
        <TrustHeroSection />
      </section>

      {/* Secção Sobre o Dev (Paulo Henrique) com Sparkles */}
      <section id="sobre">
        <AboutSparklesSection />
      </section>

      {/* Footer / Contato */}
      <section id="contato">
        <FooterSection />
      </section>
    </main>
  );
}
