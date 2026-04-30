import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
            <Heart size={40} className="text-gray-300" />
          </div>
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter">YOUR WISHLIST IS EMPTY</h2>
        <p className="text-gray-500 mb-8">Save items you love to find them easily later.</p>
        <Link to="/shop" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all inline-block">
          EXPLORE PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">WISHLIST</h1>
          <p className="text-gray-500">You have {wishlist.length} items saved in your collection.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
