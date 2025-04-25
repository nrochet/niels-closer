
import React from 'react';
import { User, Star, Calendar } from 'lucide-react';

const AboutMe = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="w-full md:w-2/5" data-animate="fade-in">
            <div className="relative">
              <div className="bg-resume-blue/10 absolute -top-6 -left-6 w-full h-full rounded-lg"></div>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780&auto=format&fit=crop"
                  alt="Sales Professional"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5" data-animate="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6 text-resume-charcoal">
              About Me
            </h2>

            <p className="text-gray-700 text-lg mb-6 font-inter">
              With a strong background in high-ticket sales and a passion for real estate investing, I've mastered the art of turning prospects into partners. My career spans real estate, solar sales, and consultative selling, giving me a unique perspective on closing deals that matter.
            </p>
            <p className="text-gray-700 text-lg mb-8 font-inter">
              My mission is simple yet powerful: to help Airbnb investors scale their portfolios through strategic partnerships and unparalleled sales expertise. I understand the psychology behind high-value decisions and how to guide investors toward profitable opportunities in the short-term rental market.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center p-6 bg-resume-lightgrey rounded-lg shadow-sm transition-all hover:shadow-md">
                <div className="w-10 h-10 bg-resume-blue/10 rounded-full flex items-center justify-center mb-4">
                  <User size={20} className="text-resume-blue" />
                </div>
                <h3 className="font-montserrat font-bold text-resume-charcoal">Consultative Sales</h3>
                <p className="text-gray-600 text-center text-sm mt-2">Value-based approach</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-resume-lightgrey rounded-lg shadow-sm transition-all hover:shadow-md">
                <div className="w-10 h-10 bg-resume-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Star size={20} className="text-resume-blue" />
                </div>
                <h3 className="font-montserrat font-bold text-resume-charcoal">Results Driven</h3>
                <p className="text-gray-600 text-center text-sm mt-2">Proven track record</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-resume-lightgrey rounded-lg shadow-sm transition-all hover:shadow-md">
                <div className="w-10 h-10 bg-resume-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={20} className="text-resume-blue" />
                </div>
                <h3 className="font-montserrat font-bold text-resume-charcoal">5+ Years</h3>
                <p className="text-gray-600 text-center text-sm mt-2">Sales experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
