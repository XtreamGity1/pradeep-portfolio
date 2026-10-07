import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import About from './sections/About';
import Work from './sections/Work';
import BeforeAfter from './sections/BeforeAfter';
import Services from './sections/Services';
import Pricing from './sections/Pricing';
import Process from './sections/Process';
import Promises from './sections/Promises';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import BackToTop from './components/BackToTop/BackToTop';

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
        <Promises />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
