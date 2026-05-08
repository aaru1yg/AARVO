import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

const FeaturedProducts = () => {
  const { products } = useStore();
  const navigate = useNavigate();
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);

  useEffect(() => {
    onValue(ref(db, 'settings/featuredIds'), (snap) => {
      const data = snap.val();
      if (data) setFeaturedIds(data);
    });
  }, []);

  // Use admin-selected featured OR first 4 products
  const featured = featuredIds.length > 0
    ? featuredIds.map(id => products.find(p => p.id === id)).filter(Boolean)
    : products.slice(0, 4);

  return (
    <section id="shop" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 text-[20rem] font-black text-gray-50 leading-none select-none -z-10 translate-x-1/4 -translate-y-1/4">
        NEW
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[1px] bg-black"></div>
              <span className="text-[10px] uppercase font-bold tracking-widest">Selected Items</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              FEATURED ARRIVALS
            </motion.h2>
          </div>
          <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            onClick={() => navigate('/shop')}
            className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-2 group">
            View All Products
            <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-150 transition-transform"></div>
          </motion.button>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-2xl font-bold">No products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product: any, index) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;