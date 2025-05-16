import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, User, CalendarClock } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  const openCalendly = () => {
    window.open('https://calendly.com/nsrochet/30min', '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6 text-resume-charcoal">
              How to get in touch
            </h2>
            <p className="text-gray-600 mb-8 font-inter max-w-lg">
              Schedule some time by clicking on my calendar link below. Let's discuss how my high-ticket closing expertise can help you secure more clients and scale your operations.
            </p>

            {/* Schedule a call box - enhanced and more prominent */}
            <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-resume-blue/10 flex items-center justify-center mr-4">
                  <CalendarClock size={24} className="text-resume-blue" />
                </div>
                <h3 className="text-xl font-bold">Ready to scale your coaching enrollments and boost your revenue?</h3>
              </div>
              <p className="text-gray-600 mb-6">Book a 30-minute consultation to discuss your revenue goals and how I can help you achieve them.</p>
              <Button 
                className="w-full py-6 bg-resume-blue hover:bg-resume-blue/90 text-white font-semibold text-base"
                onClick={openCalendly}
              >
                Open My Calendar
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold mb-6 text-resume-charcoal font-montserrat">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <User size={16} />
                  </div>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Mail size={16} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Phone size={16} />
                  </div>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your investment goals..."
                  rows={4}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-resume-blue hover:bg-resume-blue/90 text-white py-6"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

