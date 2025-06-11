import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
const WhyMe = () => {
  const skillsRef = useRef<HTMLDivElement>(null);
  const skills = [{
    title: "Real Estate Market Expertise",
    percentage: 95,
    description: "Comprehensive understanding of the short-term rental market and the broader real estate landscape, including its investment potential."
  }, {
    title: "Negotiation Skills",
    percentage: 90,
    description: "Expert at finding win-win scenarios that maximize value for all parties."
  }, {
    title: "Investment Analysis",
    percentage: 85,
    description: "Ability to identify profitable properties and calculate potential ROI accurately."
  }, {
    title: "Client Relationship Management",
    percentage: 98,
    description: "Building trust and maintaining long-term partnerships with investors."
  }, {
    title: "Closing Techniques",
    percentage: 92,
    description: "Proven methods for overcoming objections and finalizing high-value deals."
  }];
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          const progressBars = document.querySelectorAll('.progress-bar');
          progressBars.forEach((bar, index) => {
            setTimeout(() => {
              (bar as HTMLElement).style.width = '100%';
            }, 300 + index * 150);
          });
        }, 500);
      }
    }, {
      threshold: 0.1
    });
    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }
    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, [skills]);
  return <section id="why-me" className="py-24 bg-gradient-to-br from-resume-blue to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16" data-animate="fade-in">
          <h2 className="text-3xl md:text-5xl font-bold font-montserrat mb-4 text-white">A Bit About Me</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-blue-100 max-w-3xl mx-auto font-inter text-lg">I bridge the gap between sales expertise and real estate investment knowledge, helping you grow your pipeline fast.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl" data-animate="fade-in">
            <CardContent className="p-8">
              <div className="prose prose-lg text-white max-w-none">
                <p className="mb-6 text-blue-50 leading-relaxed">
                  Real estate investing demands more than enthusiasm. It requires a deep understanding of ROI, financing, and long-term value creation. In the world of high-ticket sales, the right closer can mean the difference between enrolling serious investors and leaving revenue on the table.
                </p>
                
                <p className="mb-6 text-blue-50 leading-relaxed">
                  Top closers don’t just convert leads. They drive growth, amplify your impact, and turn interest into committed investments. That’s where I come in. I specialize in:
                </p>

                <ul className="space-y-4 list-none pl-0 mb-6">
                  {['Converting high-net-worth prospects into long-term clients', 'Creating compelling presentations that showcase accurate investment returns', 'Analyzing market trends and property valuation', 'Building long-term relationships that extend beyond the sale'].map((item, index) => <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <span className="text-blue-50">{item}</span>
                    </li>)}
                </ul>
                
                <p className="mt-6 text-blue-50 leading-relaxed">What sets me apart is my holistic approach to real estate high-ticket sales. I don’t just close deals: I help craft compelling investment proposals tailored to each of my client’s investing goals, unlocking their path to financial freedom.</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8" data-animate="fade-in" ref={skillsRef}>
            {skills.map((skill, index) => <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 transition-all duration-300 hover:bg-white/15">
                <div className="flex items-center mb-3">
                  <h3 className="text-white font-semibold text-lg">{skill.title}</h3>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-3 mb-4 overflow-hidden">
                  <div className="progress-bar bg-gradient-to-r from-blue-300 to-white h-full rounded-full transition-all duration-1000 ease-out" style={{
                width: '0%'
              }} />
                </div>
                <p className="text-blue-100 text-sm">{skill.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default WhyMe;
