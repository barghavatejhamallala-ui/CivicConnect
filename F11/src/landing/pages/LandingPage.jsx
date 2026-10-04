import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import RoleSelection from '../components/RoleSelection';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

function LandingPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <RoleSelection />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default LandingPage;
