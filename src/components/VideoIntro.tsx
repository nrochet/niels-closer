
import React from 'react';

const VideoIntro = () => {
  return (
    <section id="video" className="py-24 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4 text-resume-charcoal">
            Video Introduction
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter">
            Watch my quick introduction to learn more about my approach to sales and how I can help scale your Airbnb investment portfolio.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto aspect-video bg-resume-lightgrey rounded-lg overflow-hidden shadow-lg">
          {/* Placeholder for video - replace with actual video embed code */}
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">
              Video coming soon. Upload your introduction video to complete this section.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto font-inter">
            In this video, I explain my sales methodology and how I've helped investors increase their Airbnb portfolio returns by an average of 22%.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoIntro;
