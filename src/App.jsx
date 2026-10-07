import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import About from './sections/About';
import Work from './sections/Work';
import BeforeAfter from './sections/BeforeAfter';
import Services from './sections/Services';
import Pricing from './sections/Pricing';
import Process from './sections/Process';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Page composition — add, remove or reorder sections here.
export default function App() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Work />
        <BeforeAfter />
        <Services />
        <Pricing />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
