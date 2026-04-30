import { useState } from 'react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';

interface ShopPageProps {
  initialCategory?: string;
}

const ShopPage = ({ initialCategory }: ShopPageProps) => {
  const { products, loading } = useStore();
  const [category, setCategory] = useState(initialCategory || 'All');
  const [priceRange, setPriceRange] = useState(50000);
  const [sortBy, setSortBy] = useState('newest');

  // Get unique categories from Firebase products
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products
    .filter(p => {
      const categoryMatch = category === 'All' || p.category === category;
      const priceMatch = p.price <= priceRange;
      return categoryMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            SHOP {category.toUpperCase()}
          </h1>
          <p className="text-gray-500">
            {loading ? 'Loading...' : `Discover our collection of ${filteredProducts.length} premium items.`}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <SlidersHorizontal size={14} /> Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`block text-sm w-full text-left py-1 transition-colors capitalize ${
                        category === cat ? 'font-bold text-black' : 'text-gray-500 hover:text-black'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Price Range</h3>
                <input type="range" min="0" max="50000" step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                <div className="flex justify-between text-xs font-bold mt-2">
                  <span>₹0</span>
                  <span>₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {filteredProducts.length} results
              </span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-100 rounded-3xl h-80 mb-4"></div>
                    <div className="bg-gray-100 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-100 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} layout
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-500 text-lg">No products found.</p>
                <button onClick={() => { setCategory('All'); setPriceRange(50000); }}
                  className="mt-4 text-black font-bold underline">
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;