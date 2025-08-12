import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 m-0">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Books Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">BookHeaven</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Books Delivered. Imagination Unlimited. Your gateway to an endless library.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#all-books" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  All Books
                </a>
              </li>
              <li>
                <a href="#categories" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Categories
                </a>
              </li>
              <li>
                <a href="#about-us" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <span className="text-gray-500">Email:</span> support@bookheaven.com
              </p>
              <p className="text-gray-400">
                <span className="text-gray-500">Phone:</span> +1 (555) 123-4567
              </p>
              <p className="text-gray-400">
                <span className="text-gray-500">Address:</span> 123 Literary Lane, Bookville, Fictionland
              </p>
            </div>
          </div>

          {/* We Accept Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">We Accept</h3>
            <div className="flex gap-3 flex-wrap">
              {/* Visa */}
              <div className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold shadow">
                VISA
              </div>
              {/* Mastercard */}
              <div className="bg-pink-600 text-white px-3 py-1 rounded text-xs font-bold shadow">
                MASTERCARD
              </div>
              {/* American Express */}
              <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold shadow">
                AMEX
              </div>
              {/* PayPal */}
              <div className="bg-blue-800 text-white px-3 py-1 rounded text-xs font-bold shadow">
                PAYPAL
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-700 pt-5">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} BookHeaven. All rights reserved. | Crafted with ❤️ by Sonu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
