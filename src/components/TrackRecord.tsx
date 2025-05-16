import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const TrackRecord = () => {
  const achievements = [{
    metric: "98%",
    description: "Client Satisfaction Rate",
    detail: "Maintaining exceptional client relationships"
  }, {
    metric: "52%",
    description: "Conversion Rate",
    detail: "Double the industry average performance"
  }, {
    metric: "101+",
    description: "Deals Closed",
    detail: "Across real estate and solar industries"
  }];
  const companies = [{
    name: "Sunrun",
    logo: "https://cdn.brandfetch.io/idfqgwcqy_/w/400/h/400/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B"
  }, {
    name: "SGI Brokers",
    logo: "https://github.com/nrochet/niels-closer/blob/main/src/company%20logos/SGI%20brokers.png?raw=true"
  }, {
    name: "Ground Matrix",
    logo: "https://raw.githubusercontent.com/nrochet/niels-closer/refs/heads/main/src/company%20logos/Ground%20Matrix.webp"
  }];
  return <section id="track-record" className="py-24 bg-resume-lightgrey">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4 text-resume-charcoal">
            Sales Track Record
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter">
            A proven history of exceeding targets and building lasting client relationships.
          </p>
        </div>

        {/* Achievements Carousel - without navigation arrows */}
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {achievements.map((item, index) => <CarouselItem key={index} className="md:basis-1/3">
                <div className="p-2">
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
                    <CardContent className="flex flex-col items-center text-center p-8 bg-white">
                      <div className="text-4xl font-bold text-resume-blue font-montserrat">{item.metric}</div>
                      <h3 className="font-semibold mt-3 mb-2 text-resume-charcoal">{item.description}</h3>
                      <p className="text-sm text-gray-500">{item.detail}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>)}
          </CarouselContent>
        </Carousel>

        {/* Companies worked with */}
        <div className="mt-20">
          <h3 className="text-center text-xl font-semibold mb-8 text-gray-600">Companies I've Worked With</h3>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {companies.map((company, index) => <div key={index} className="w-32 md:w-40 grayscale hover:grayscale-0 transition-all duration-300">
                <img src={company.logo} alt={company.name} className="w-full h-auto" />
              </div>)}
          </div>
        </div>

        {/* Sales Metrics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-lg shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-resume-blue/10 flex items-center justify-center mb-4">
                <span className="text-resume-blue text-2xl font-bold">$</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Average Deal Size</h3>
              <p className="text-3xl font-bold text-resume-blue">$10,500</p>
              <p className="text-gray-500 mt-2 text-center">Specializing in high-ticket opportunities</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-resume-blue/10 flex items-center justify-center mb-4">
                <span className="text-resume-blue text-2xl font-bold">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Average Deal Cycle Time</h3>
              <p className="text-3xl font-bold text-resume-blue">15 days</p>
              <p className="text-gray-500 mt-2 text-center">Efficient closing process</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-resume-blue/10 flex items-center justify-center mb-4">
                <span className="text-resume-blue text-2xl font-bold">★</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Retention</h3>
              <p className="text-3xl font-bold text-resume-blue">91%</p>
              <p className="text-gray-500 mt-2 text-center">Building lasting relationships</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default TrackRecord;
