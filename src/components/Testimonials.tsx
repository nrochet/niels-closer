
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Rodriguez",
      role: "Property Investor",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1587&auto=format&fit=crop",
      quote: "Working with this sales closer transformed our Airbnb portfolio strategy. Their ability to identify opportunities and close deals quickly gave us a competitive edge in a crowded market.",
      stars: 5
    },
    {
      name: "Sarah Johnson",
      role: "Regional Sales Manager, Sunrun",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1588&auto=format&fit=crop",
      quote: "One of the most talented closers I've worked with. Their consultative approach and deep understanding of customer needs consistently delivered top-tier results for our team.",
      stars: 5
    },
    {
      name: "Michael Chen",
      role: "Real Estate Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1587&auto=format&fit=crop",
      quote: "Their ability to articulate complex investment opportunities in simple terms helped us secure multiple premium properties. I was impressed by both the strategic vision and execution.",
      stars: 5
    },
    {
      name: "Jennifer Williams",
      role: "Investment Consultant",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522&auto=format&fit=crop",
      quote: "Beyond just sales skills, they bring genuine market insight and investment knowledge to every conversation. This combination creates trust and delivers exceptional results.",
      stars: 4
    },
  ];

  const renderStars = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => (
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      ));
  };

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-resume-lightgrey to-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4 text-resume-charcoal">
            Testimonials
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter">
            Don't just take my word for it. Here's what clients and colleagues have to say about working with me.
          </p>
        </div>

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-4">
                  <Card className="border-none shadow-lg rounded-xl overflow-hidden h-full">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-resume-charcoal">{testimonial.name}</h3>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                          <div className="flex mt-1">
                            {renderStars(testimonial.stars)}
                          </div>
                        </div>
                      </div>
                      <blockquote className="flex-grow">
                        <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                      </blockquote>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
