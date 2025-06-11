import React from 'react';
import { Button } from '@/components/ui/button';
const HeroBanner = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop")'
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 text-white px-4 sm:px-6 text-center md:text-left">
        <div className="max-w-4xl animate-fade-in opacity-0" style={{
        animationDelay: '0.3s'
      }}>
          <h1 className="font-montserrat font-bold text-4xl sm:text-5xl md:text-6xl mb-6">
            High-Ticket Sales Closer
            <span className="block text-xl sm:text-2xl md:text-3xl mt-2 text-resume-lightblue">For All Your Real Estate Investing Programs</span>
          </h1>
          
          <p className="font-inter text-lg sm:text-xl mb-8 text-white/90 max-w-2xl">Turning conversations into conversions </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button onClick={scrollToContact} className="bg-resume-blue hover:bg-resume-blue/90 text-white font-semibold py-6 px-8 text-lg">
              Let's Close Together
            </Button>
            <Button onClick={() => document.getElementById('about')?.scrollIntoView({
            behavior: 'smooth'
          })} variant="outline" className="text-white font-medium py-6 px-8 text-lg bg-resume-blue border-0">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/70 flex justify-center items-start p-1">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-[scroll_1.5s_infinite]"></div>
        </div>
      </div>
    </section>;
};
export default HeroBanner;