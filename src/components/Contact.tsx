
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, Linkedin, User } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6 text-resume-charcoal">
              Let's Connect
            </h2>
            <p className="text-gray-600 mb-8 font-inter max-w-lg">
              Ready to take your Airbnb investment portfolio to the next level? Let's discuss how my high-ticket closing expertise can help you secure the best properties and partnerships.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-resume-blue/10 flex items-center justify-center mr-4">
                  <Mail size={18} className="text-resume-blue" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">carhop.consult-0n@icloud.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-resume-blue/10 flex items-center justify-center mr-4">
                  <Phone size={18} className="text-resume-blue" />
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-resume-blue/10 flex items-center justify-center mr-4">
                  <Linkedin size={18} className="text-resume-blue" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">LinkedIn</p>
                  <a href="#" className="font-medium text-resume-blue hover:underline">linkedin.com/in/salescloser</a>
                </div>
              </div>
            </div>

            {/* Calendar widget placeholder */}
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
              <h3 className="font-semibold mb-2">Schedule a Call</h3>
              <p className="text-sm text-gray-600 mb-4">Book a 30-minute consultation</p>
              <Button className="bg-resume-blue hover:bg-resume-blue/90 text-white">
                Open Calendar
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
