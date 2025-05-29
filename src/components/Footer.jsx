import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Section 1: Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold mb-3">EZ NEWS</h2>
          <p className="text-sm mb-4 text-gray-400">
            info@eznews@gmail.com
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            From breaking news to thought-provoking opinion pieces, our site keeps you informed & engaged.
          </p>
        </div>

        {/* Section 2: Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer">General</li>
            <li className="hover:text-white cursor-pointer">World</li>
            <li className="hover:text-white cursor-pointer">Nation</li>
            <li className="hover:text-white cursor-pointer">Health</li>
            <li className="hover:text-white cursor-pointer">Business</li>
            <li className="hover:text-white cursor-pointer">Technology</li>
            <li className="hover:text-white cursor-pointer">Entertainment</li>
            <li className="hover:text-white cursor-pointer">Sports</li>
            <li className="hover:text-white cursor-pointer">Science</li>

          </ul>
        </div>


        {/* Section 3: Resources + Social */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Advertise</li>
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer">License</li>
            </ul>
          </div>

          <div className="flex gap-6 mt-6">
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} EZ NEWS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
