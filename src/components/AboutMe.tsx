import React from 'react';
import { User, Star, Calendar } from 'lucide-react';
const AboutMe = () => {
  return <section id="about" className="py-24 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="w-full md:w-2/5" data-animate="fade-in">
            <div className="relative">
              <div className="bg-resume-blue/10 absolute -top-6 -left-6 w-full h-full rounded-lg"></div>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                <img alt="Sales Professional" src="/lovable-uploads/22f50ebe-5247-40d3-abfb-f983f5b1598b.jpg" className="w-full h-full object-none" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5" data-animate="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6 text-resume-charcoal">
              About Me
            </h2>

            <p className="text-gray-700 text-lg mb-6 font-inter">
  
              With a strong background and a passion for real estate investing and sales, I’ve mastered the art of turning prospects into partners, navigating complex sales cycles and building trust at every stage.
            </p>
           <p className="text-gray-700 text-lg mb-6 font-inter">Born and raised in France, I moved to the U.S. in pursuit of the American dream, earning a world-class education at one of the most prestigious institutions in the nation, UC Berkeley. Yet the most valuable lesson wasn’t in the lecture halls. It was realizing that following the golden traditional corporate path meant settling for less than my full potential.</p>
           <p className="text-gray-700 text-lg mb-8 font-inter">
           Over the years, that insight led me to forge my own path: one defined by exponential growth, freedom, and meaningful impact.
            </p>
            <p className="text-gray-700 text-lg mb-8 font-inter">Today, my mission is simple yet powerful: to help Airbnb investors scale their coaching programs, boost revenue, and buy back their time. I understand the psychology behind high-value decisions and how to empower and guide high-intent leads toward profitable opportunities in the short-term rental market.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col p-6 bg-resume-lightgrey rounded-lg shadow-sm transition-all hover:shadow-md h-full">
                <div className="w-10 h-10 bg-resume-blue/10 rounded-full flex items-center justify-center mb-4">
                  <User size={20} className="text-resume-blue" />
                </div>
                <h3 className="font-montserrat font-bold text-resume-charcoal mb-2 text-left">High-Ticket Sales Expertise</h3>
                <p className="text-gray-600 text-sm text-left">5+ years closing deals priced $20k-$70k through ROI-driven consultations.</p>
              </div>

              <div className="flex flex-col p-6 bg-resume-lightgrey rounded-lg shadow-sm transition-all hover:shadow-md h-full">
                <div className="w-10 h-10 bg-resume-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Star size={20} className="text-resume-blue" />
                </div>
                <h3 className="font-montserrat font-bold text-resume-charcoal mb-2 text-left">Results You Can Measure</h3>
                <p className="text-gray-600 text-sm text-left">Boost your enrollments and revenue in under than 90 days with proven sales strategies.</p>
              </div>

              <div className="flex flex-col p-6 bg-resume-lightgrey rounded-lg shadow-sm transition-all hover:shadow-md h-full">
                <div className="w-10 h-10 bg-resume-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={20} className="text-resume-blue" />
                </div>
                <h3 className="font-montserrat font-bold text-resume-charcoal mb-2 text-left">Full Sales Cycle Support</h3>
                <p className="text-gray-600 text-sm text-left">Build and optimize every step of your high-ticket sales funnel with scalable systems from lead qualification to close.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default AboutMe;