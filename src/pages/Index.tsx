
import React, { useEffect } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import AboutMe from "@/components/AboutMe";
import TrackRecord from "@/components/TrackRecord";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
// Remove the FluidBackground import entirely
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
    <div className="bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 min-h-screen">
      {/* Remove the FluidBackground component */}
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
