import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 py-12 px-4 sm:px-6 lg:px-8"> {/* Adjusted vertical padding to py-12 */}
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Books Section */}
          <div>
            <h3 className="text-2xl font-bold text-indigo-400 mb-5">BookStore</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Discover endless stories and knowledge. Your gateway to an immersive reading experience.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/home" className="text-gray-400 hover:text-indigo-300 transition-colors duration-300 text-base">
                  Home
                </a>
              </li>
              <li>
                <a href="/all-books" className="text-gray-400 hover:text-indigo-300 transition-colors duration-300 text-base">
                  All Books
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-indigo-300 transition-colors duration-300 text-base">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-indigo-300 transition-colors duration-300 text-base">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-white">Contact</h3>
            <div className="space-y-3 text-base">
              <p className="text-gray-400">
                <span className="font-medium text-gray-300">Email:</span> support@bookstore.com
              </p>
              <p className="text-gray-400">
                <span className="font-medium text-gray-300">Phone:</span> +1 (555) 123-4567
              </p>
              <p className="text-gray-400">
                <span className="font-medium text-gray-300">Address:</span> 123 Literary Lane, Bookville, Fictionland
              </p>
            </div>
          </div>

          {/* We Accept Section */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-white">We Accept</h3>
            <div className="flex gap-4 flex-wrap">
              {/* Visa */}
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                VISA
              </div>
              {/* Mastercard */}
              <div className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                MASTERCARD
              </div>
              {/* American Express */}
              <div className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                AMEX
              </div>
              {/* PayPal */}
              <div className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                PAYPAL
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-700 pt-8">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} BookStore. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
