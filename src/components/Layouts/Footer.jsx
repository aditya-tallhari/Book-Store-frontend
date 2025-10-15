import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Facebook, Instagram, Send } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    shop: [
      { title: "All Books", href: "/all-books" },
      { title: "My Library", href: "/profile/my-library" },
      { title: "Cart", href: "/cart" },
    ],
    company: [
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
    legal: [
        { title: "Privacy Policy", href: "/privacy-policy" },
        { title: "Terms of Service", href: "/terms-of-service" },
    ]
  };

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand and Newsletter Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-indigo-500" />
                <h1 className="text-2xl font-bold text-white">BookStore</h1>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Your digital library and gateway to endless stories. Discover your next favorite book with us.
            </p>
            <div className="mt-6">
              <p className="font-semibold text-white">Subscribe to our newsletter</p>
              <form className="mt-2 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 rounded-md bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-700"
                  aria-label="Subscribe"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-white">Shop</p>
              <ul className="mt-4 space-y-2 text-sm">
                {footerLinks.shop.map(link => (
                  <li key={link.title}>
                    <Link to={link.href} className="transition hover:text-white">{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white">Company</p>
              <ul className="mt-4 space-y-2 text-sm">
                {footerLinks.company.map(link => (
                  <li key={link.title}>
                    <Link to={link.href} className="transition hover:text-white">{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <p className="font-semibold text-white">Legal</p>
              <ul className="mt-4 space-y-2 text-sm">
                {footerLinks.legal.map(link => (
                  <li key={link.title}>
                    <Link to={link.href} className="transition hover:text-white">{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Socials */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} BookStore. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="transition hover:text-white" aria-label="Twitter">
              <Twitter size={20} />
            </Link>
            <Link to="#" className="transition hover:text-white" aria-label="Facebook">
              <Facebook size={20} />
            </Link>
            <Link to="#" className="transition hover:text-white" aria-label="Instagram">
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
