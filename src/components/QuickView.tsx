import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { useStore, Product } from '../store/useStore';

interface QuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const QuickView = ({ product, isOpen, onClose }: QuickViewProps) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return null;

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image ? [product.image] : ['/images/gadget-1.jpg'];

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-5xl rounded-[2.5rem] overflow-hidden relative z-10 flex flex-col md:flex-row shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg z-20 hover:scale-110 transition-transform">
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 relative bg-gray-50">
              <div className="aspect-square relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={images[activeImg]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    {product.category}
                  </span>
                  {discount && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">
                      -{discount}% OFF
                    </span>
                  )}
                  {product.badge && (
                    <span className={`text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      product.badge === 'hot' ? 'bg-red-500' :
                      product.badge === 'new' ? 'bg-blue-500' :
                      product.badge === 'sale' ? 'bg-orange-500' : 'bg-purple-500'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                        activeImg === i ? 'border-black' : 'border-gray-200'
                      }`}>
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              {product.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16}
                      className={`${i < Math.floor(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-sm text-gray-400 ml-2">({product.rating} / 5.0)</span>
                </div>
              )}

              <h2 className="text-4xl font-black mb-4 tracking-tight">{product.name}</h2>

              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                {product.originalPrice && (
                  <div>
                    <p className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-green-500 font-bold">Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>

              <p className="text-gray-500 mb-6 leading-relaxed">
                {product.description || 'Premium quality product crafted with precision and designed for timeless elegance.'}
              </p>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                {product.freeDelivery ? (
                  <p className="text-green-600 font-bold text-sm">Free Delivery</p>
                ) : (
                  <p className="text-gray-600 text-sm font-bold">Delivery: ₹{product.deliveryCharge || 99}</p>
                )}
                {product.cod && <p className="text-gray-600 text-sm mt-1">Cash on Delivery available</p>}
                {product.stock && product.stock <= 5 && (
                  <p className="text-red-500 text-sm font-bold mt-1">Only {product.stock} left!</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleAddToCart}
                  className={`flex-1 px-8 py-5 rounded-full font-bold transition-all flex items-center justify-center gap-3 ${
                    added ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
                  }`}>
                  <ShoppingCart size={20} />
                  {added ? 'Added!' : 'Add to Cart'}
                </button>
                <button onClick={() => toggleWishlist(product)}
                  className={`p-5 border-2 rounded-full transition-all ${
                    isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickView;