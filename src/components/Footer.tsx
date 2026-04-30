
import { MapPin, Phone, Mail, Globe, Share2, MessageCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold tracking-tighter mb-6 text-black">AAROV</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your destination for premium electronics, fashion, and home lifestyle. We curate the world's most elegant essentials.
            </p>
                <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                <Share2 size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                <MessageCircle size={20} />
              </a>
              <Link to="/admin" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                <User size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-500 hover:text-black transition-colors">Shop All</Link></li>
              <li><Link to="/wishlist" className="text-gray-500 hover:text-black transition-colors">Wishlist</Link></li>
              <li><Link to="/checkout" className="text-gray-500 hover:text-black transition-colors">Cart</Link></li>
              <li><Link to="/admin" className="text-gray-500 hover:text-black transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-6">Customer Care</h3>
            <ul className="space-y-4">
              {['Shipping Policy', 'Returns & Exchanges', 'Track Order', 'FAQ', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-black transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Store Locator</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin size={20} className="shrink-0 text-black" />
                <span>123 Fashion Street, <br />Manhattan, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone size={20} className="shrink-0 text-black" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Mail size={20} className="shrink-0 text-black" />
                <span>hello@aarov.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2024 Aarov Ecommerce. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
