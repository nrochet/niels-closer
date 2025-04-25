
import React from 'react';

const WhyMe = () => {
  const skills = [
    {
      title: "Airbnb Market Expertise",
      percentage: 95,
      description: "Comprehensive understanding of the short-term rental marketplace and its investment potential."
    },
    {
      title: "Negotiation Skills",
      percentage: 90,
      description: "Expert at finding win-win scenarios that maximize value for all parties."
    },
    {
      title: "Investment Analysis",
      percentage: 85,
      description: "Ability to identify profitable properties and calculate potential ROI accurately."
    },
    {
      title: "Client Relationship Management",
      percentage: 98,
      description: "Building trust and maintaining long-term partnerships with investors."
    },
    {
      title: "Closing Techniques",
      percentage: 92,
      description: "Proven methods for overcoming objections and finalizing high-value deals."
    },
  ];

  return (
    <section id="why-me" className="py-24 bg-resume-blue relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-white/10"></div>
        <div className="absolute top-40 right-40 w-60 h-60 rounded-full bg-white/10"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-white/10"></div>
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4 text-white">
            Why Me for Airbnb Investing
          </h2>
          <p className="text-blue-100 max-w-3xl mx-auto font-inter">
            I bridge the gap between sales expertise and Airbnb investment knowledge, helping you maximize your portfolio's potential.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="prose prose-lg text-white max-w-none">
              <p className="mb-6">
                My experience in high-ticket solar sales translates perfectly to the Airbnb investment space. Both require a deep understanding of ROI, financing options, and long-term value creation.
              </p>
              
              <p className="mb-6">
                In the competitive world of short-term rentals, having a skilled closer can mean the difference between acquiring premium properties and missing out on opportunities. I specialize in:
              </p>

              <ul className="space-y-3 list-disc pl-5">
                <li>Converting high-net-worth prospects into investment partners</li>
                <li>Negotiating favorable terms with property owners</li>
                <li>Creating compelling presentations that showcase potential returns</li>
                <li>Understanding market trends and property valuation</li>
                <li>Building a consultative relationship that extends beyond the sale</li>
              </ul>
              
              <p className="mt-6">
                What sets me apart is my holistic approach to Airbnb investing. I don't just close deals—I help create sustainable, profitable investment strategies tailored to each client's goals.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {skills.map((skill, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">{skill.title}</span>
                  <span className="text-white">{skill.percentage}%</span>
                </div>
                <div className="w-full bg-blue-900 rounded-full h-2.5">
                  <div
                    className="bg-white h-2.5 rounded-full"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
                <p className="text-blue-100 text-sm mt-2">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMe;
