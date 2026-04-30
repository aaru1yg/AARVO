import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import QuickView from './QuickView';
import { useStore, Product } from '../store/useStore';

const ProductCard = (product: Product) => {
  const { id, name, price, originalPrice, image, category, rating, badge } = product;
  const { toggleWishlist, addToCart, wishlist } = useStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const isWishlisted = wishlist.some(item => item.id === id);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl relative"
      >
        <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
          className="relative aspect-[4/5] overflow-hidden">
          <img src={image || '/images/gadget-1.jpg'} alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            {badge && (
              <span className={`text-white text-xs font-black px-2 py-1 rounded-full ${
                badge === 'hot' ? 'bg-red-500' :
                badge === 'new' ? 'bg-blue-500' :
                badge === 'sale' ? 'bg-orange-500' :
                badge === 'limited' ? 'bg-yellow-500' :
                badge === 'bestseller' ? 'bg-purple-500' : 'bg-black'
              }`}>
                {badge.toUpperCase()}
              </span>
            )}
            {discount && (
              <span className="bg-green-500 text-white text-xs font-black px-2 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
              className={`p-2 rounded-full shadow-lg transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white hover:bg-black hover:text-white'}`}>
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button onClick={handleAddToCart}
              className={`p-2 rounded-full shadow-lg transition-colors ${added ? 'bg-green-500 text-white' : 'bg-white hover:bg-black hover:text-white'}`}>
              <ShoppingCart size={18} />
            </button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
              className="bg-white/90 backdrop-blur-md text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl">
              Quick View
            </button>
          </div>

          <div style={{ transform: "translateZ(50px)" }} className="absolute bottom-4 left-4">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
              {category}
            </span>
          </div>
        </div>

        <div style={{ transform: "translateZ(50px)" }} className="p-5">
          {rating && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14}
                  className={`${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-xs text-gray-400 ml-1">({rating})</span>
            </div>
          )}
          <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-black">₹{price.toLocaleString('en-IN')}</p>
            {originalPrice && (
              <p className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</p>
            )}
          </div>
        </div>
      </motion.div>

      <QuickView product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  );
};

export default ProductCard;