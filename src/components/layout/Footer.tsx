import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Instagram, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-800 border-t border-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Palette className="w-8 h-8 text-secondary-500" />
              <span className="text-xl font-bold text-secondary-50">Craftopia</span>
            </Link>
            <p className="mt-4 text-secondary-300 text-sm">
              The premier marketplace for creative services, connecting talented artists and craftspeople with customers worldwide.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-secondary-200 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-secondary-200 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-secondary-200 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-secondary-200 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-secondary-50 font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore?category=graphic-design" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Graphic Design
                </Link>
              </li>
              <li>
                <Link to="/explore?category=digital-art" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Digital Art
                </Link>
              </li>
              <li>
                <Link to="/explore?category=handmade-crafts" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Handmade Crafts
                </Link>
              </li>
              <li>
                <Link to="/explore?category=photography" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Photography
                </Link>
              </li>
              <li>
                <Link to="/explore?category=music-production" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Music & Audio
                </Link>
              </li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="text-secondary-50 font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-secondary-50 font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/trust-safety" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-300 hover:text-secondary-50 text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © {new Date().getFullYear()} Craftopia. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <a href="mailto:info@craftopia.com" className="text-secondary-400 hover:text-secondary-200 flex items-center text-sm transition-colors">
              <Mail className="w-4 h-4 mr-1" />
              info@craftopia.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};