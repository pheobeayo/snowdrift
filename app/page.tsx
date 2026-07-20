import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Engines } from "@/components/landing/Engines";
import { Primitives } from "@/components/landing/Primitives";
import { Cta } from "@/components/landing/Cta";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-0 text-ink-1">
      <Navbar />
      <Hero />
      <Engines />
      <Primitives />
      <Cta />
      <Footer />
    </div>
  );
}
