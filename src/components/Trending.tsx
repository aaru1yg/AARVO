import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const Trending = () => {
  const { products } = useStore();
  const navigate = useNavigate();

  const trendingItems = products.slice(0, 3);

  return (
    <section id="trending" className="py-32 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 bg-white/10 rounded-2xl">
            <TrendingUp size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">TRENDING NOW</h2>
            <p className="text-gray-400">What the world is talking about right now.</p>
          </div>
        </div>

        {trendingItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-bold">No products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {trendingItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group relative flex flex-col cursor-pointer"
                onClick={() => navigate('/shop')}
              >
                <div className="text-8xl md:text-[10rem] font-black opacity-10 absolute -top-12 -left-6 z-0 group-hover:opacity-20 transition-opacity">
                  0{index + 1}
                </div>
                <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 z-10 shadow-2xl">
                  <img
                    src={item.image || '/images/gadget-1.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <button className="absolute bottom-6 right-6 p-4 bg-white text-black rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight size={24} />
                  </button>
                </div>
                <div className="z-10">
                  <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-500 mb-2 block">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-gray-300 transition-colors">{item.name}</h3>
                  <p className="text-orange-400 font-black mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Trending;