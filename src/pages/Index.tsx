import React, { useEffect } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import AboutMe from "@/components/AboutMe";
import TrackRecord from "@/components/TrackRecord";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FluidBackground from "@/components/Fluid Background";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Index = () => {
  useScrollAnimation();
  
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll("[data-animate]");
      elements.forEach((element) => {
        const position = element.getBoundingClientRect();
        
        // If element is in viewport
        if (position.top < window.innerHeight - 100) {
          const animation = element.getAttribute("data-animate");
          element.classList.add(`animate-${animation}`);
          // Cast the element to HTMLElement to access style property
          (element as HTMLElement).style.opacity = "1";
          element.removeAttribute("data-animate");
        }
      });
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <FluidBackground 
        colorPalette={[
          { r: 0.3, g: 0.1, b: 0.9 },  // Purple
          { r: 0.0, g: 0.5, b: 0.9 },  // Ocean Blue
          { r: 0.1, g: 0.3, b: 0.7 },  // Deep Blue
          { r: 0.4, g: 0.2, b: 0.8 },  // Lavender
        ]}
        densityDissipation={0.97}
        velocityDissipation={0.98}
        curl={30}
        pressureIterations={20}
        shading={true}
        transparent={true}
      />
      <Header />
      <HeroBanner />
      <AboutMe />
      <TrackRecord />
      <WhyMe />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
