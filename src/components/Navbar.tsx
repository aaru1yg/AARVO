import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

import SearchOverlay from './SearchOverlay';

import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Navbar = () => {
  const { cart, wishlist } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className={`text-2xl font-black tracking-[0.2em] ${isScrolled ? 'text-black' : 'text-white'}`}>
                AAROV
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
              { name: 'Electronics', path: '/category/Electronics' },
              { name: 'Fragrances', path: '/category/Fragrances' },
              { name: 'Smart Home', path: '/category/Smart-Home' },
            ].map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }}>
                <Link
                  to={item.path}
                  className={`text-[11px] uppercase tracking-[0.3em] font-bold relative group ${isScrolled ? 'text-black' : 'text-white'}`}
                >
                  {item.name}
                  <span className={`absolute -bottom-2 left-0 w-0 h-[2px] ${isScrolled ? 'bg-black' : 'bg-white'} transition-all duration-300 group-hover:w-full`} />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`${isScrolled ? 'text-black' : 'text-white'} hover:opacity-70 transition-opacity`}
            >
              <Search size={20} />
            </button>
            <Link to="/wishlist" className={`hidden md:block ${isScrolled ? 'text-black' : 'text-white'} hover:opacity-70 transition-opacity relative`}>
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/checkout" className={`${isScrolled ? 'text-black' : 'text-white'} hover:opacity-70 transition-opacity relative`}>
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cart.length}
                </span>
              )}
            </Link>
            <button 
              className={`md:hidden ${isScrolled ? 'text-black' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-4">
            {['Home', 'Shop', 'Categories', 'Collections', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-medium text-black border-b border-gray-100 pb-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex gap-4 pt-2">
              <User size={20} />
              <Heart size={20} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
