
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex justify-between items-center">
        <div className="text-xl font-semibold font-montserrat">
          <span className={`${scrolled ? 'text-resume-charcoal' : 'text-white'}`}>
            Sales<span className="text-resume-blue">Closer</span>
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          {['about', 'track-record', 'why-me', 'testimonials', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`font-inter text-sm transition-colors duration-300 ${
                scrolled ? 'text-resume-charcoal hover:text-resume-blue' : 'text-white/90 hover:text-white'
              }`}
            >
              {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => scrollToSection('contact')}
            className={`font-montserrat font-medium transition-all ${
              scrolled
                ? 'bg-resume-blue text-white hover:bg-resume-blue/90'
                : 'bg-white text-resume-charcoal hover:bg-white/90'
            }`}
          >
            Let's Talk
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
