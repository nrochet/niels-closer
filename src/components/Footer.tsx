import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-resume-charcoal text-white py-12">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="font-montserrat text-xl font-semibold mb-2">
              Sales<span className="text-resume-blue">Closer</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Turning conversations into conversions for short-term rental success.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Sales Closer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
