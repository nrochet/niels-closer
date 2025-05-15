
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const VideoIntro = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4 text-resume-charcoal">
            Video Introduction
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter">
            Watch how I approach high-ticket sales for Airbnb investments and what makes my closing strategy different.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div 
            className="relative aspect-video rounded-xl overflow-hidden shadow-xl cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* Video thumbnail - replace with your actual thumbnail */}
            <img 
              src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2832&auto=format&fit=crop" 
              alt="Video thumbnail" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
              <Button 
                className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                variant="ghost"
              >
                <Play size={30} className="text-resume-blue ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl p-0 bg-black overflow-hidden">
            <div className="aspect-video w-full">
              {/* Replace with your actual video embed */}
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>Your video would play here. Replace with actual embed code.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default VideoIntro;
