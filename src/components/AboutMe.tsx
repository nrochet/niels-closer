
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { User, Star, Calendar, CheckCircle, Award, Target, TrendingUp } from 'lucide-react';

const AboutMe = () => {
  const skills = [
    { name: 'Consultative Selling', percentage: 95, icon: <User size={18} className="text-resume-blue" /> },
    { name: 'Client Relationship Management', percentage: 98, icon: <Star size={18} className="text-resume-blue" /> },
    { name: 'Strategic Negotiation', percentage: 92, icon: <Target size={18} className="text-resume-blue" /> },
    { name: 'Market Analysis', percentage: 88, icon: <TrendingUp size={18} className="text-resume-blue" /> },
  ];

  const keyPoints = [
    { text: 'Value-based sales approach focused on solving client needs', icon: <CheckCircle size={16} className="text-resume-blue" /> },
    { text: 'Expertise in real estate and solar industries', icon: <CheckCircle size={16} className="text-resume-blue" /> },
    { text: 'Proven track record of successful deal closures', icon: <CheckCircle size={16} className="text-resume-blue" /> },
    { text: 'Background in high-ticket consultative selling', icon: <CheckCircle size={16} className="text-resume-blue" /> },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container px-4 sm:px-6">
        {/* Section Header with Larger, More Prominent Title */}
        <div className="text-center mb-16" data-animate="fade-in">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-3 text-resume-charcoal">
            About Me
          </h2>
          <div className="w-24 h-1 bg-resume-blue mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter text-lg">
            Sales closer with a passion for delivering exceptional results
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          {/* Left Column - Image with Card Overlay */}
          <div className="w-full md:w-2/5" data-animate="fade-in">
            <div className="relative">
              <div className="bg-resume-blue/10 absolute -top-6 -left-6 w-full h-full rounded-lg"></div>
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  alt="Sales Professional" 
                  src="/lovable-uploads/22f50ebe-5247-40d3-abfb-f983f5b1598b.jpg" 
                  className="w-full h-full object-cover"
                />
                {/* Modern overlay with key statistics */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-6">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-resume-blue/10 rounded-full mx-auto mb-2">
                        <User size={20} className="text-resume-blue" />
                      </div>
                      <p className="font-montserrat font-semibold">Sales</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-resume-blue/10 rounded-full mx-auto mb-2">
                        <Star size={20} className="text-resume-blue" />
                      </div>
                      <p className="font-montserrat font-semibold">Results</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-resume-blue/10 rounded-full mx-auto mb-2">
                        <Calendar size={20} className="text-resume-blue" />
                      </div>
                      <p className="font-montserrat font-semibold">5+ Years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content and Skills */}
          <div className="w-full md:w-3/5" data-animate="fade-in">
            {/* Clean, Scannable Content with Improved Typography */}
            <div className="mb-8 space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed font-inter">
                With a strong background in high-ticket sales and a passion for real estate investing, I've mastered the art of turning prospects into partners. My career spans real estate, solar sales, and consultative selling.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed font-inter">
                My mission is simple yet powerful: to help Airbnb investors scale their portfolios through strategic partnerships and unparalleled sales expertise.
              </p>

              {/* Key Points with Icons for Visual Appeal */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-1">{point.icon}</div>
                    <p className="text-gray-700">{point.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Skill Bars with Improved Visual Design */}
            <div className="mt-10">
              <h3 className="text-xl font-montserrat font-bold mb-6 text-resume-charcoal">Key Expertise</h3>
              
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {skill.icon}
                        <span className="font-medium text-gray-800">{skill.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-resume-blue">{skill.percentage}%</span>
                    </div>
                    <Progress 
                      value={skill.percentage} 
                      className="h-2 bg-gray-200" 
                      style={{
                        backgroundImage: 'linear-gradient(to right, #2c5282, #4299e1)',
                        clipPath: `polygon(0 0, ${skill.percentage}% 0, ${skill.percentage}% 100%, 0% 100%)`
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Professional Recognition Cards */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-resume-lightgrey p-5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Award size={20} className="text-resume-blue" />
                    <h4 className="font-montserrat font-semibold">Education</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Sales Management Certification, Stanford University</p>
                </div>
                <div className="bg-resume-lightgrey p-5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Award size={20} className="text-resume-blue" />
                    <h4 className="font-montserrat font-semibold">Recognition</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Top Sales Performer, Sunrun (2021-2022)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
