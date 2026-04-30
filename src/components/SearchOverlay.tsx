import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6"
        >
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 p-4 hover:rotate-90 transition-transform duration-300"
          >
            <X size={40} />
          </button>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Search for gadgets, decor, apparel..."
                className="w-full text-4xl md:text-7xl font-black border-b-4 border-black pb-8 focus:outline-none placeholder:text-gray-100"
              />
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-200" size={60} />
            </div>

            <div className="mt-16">
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] mb-8 text-gray-400">Popular Searches</h3>
              <div className="flex flex-wrap gap-4">
                {['Sonic Pro', 'Concrete Vase', 'Midnight Chronograph', 'Luxe Sneakers', 'Studio Chair'].map((term) => (
                  <button key={term} className="px-6 py-3 bg-gray-50 hover:bg-black hover:text-white rounded-full text-sm font-bold transition-all border border-gray-100">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
