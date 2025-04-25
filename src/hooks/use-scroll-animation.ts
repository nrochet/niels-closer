
import { useEffect } from "react";

export const useScrollAnimation = () => {
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll("[data-animate]");
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible) {
          const animation = el.getAttribute("data-animate");
          if (animation) {
            el.classList.add(`animate-${animation}`);
            el.removeAttribute("data-animate");
          }
        }
      });
    };

    // Run once on load
    animateOnScroll();
    
    // Add event listener
    window.addEventListener("scroll", animateOnScroll);
    
    // Clean up
    return () => {
      window.removeEventListener("scroll", animateOnScroll);
    };
  }, []);
};
