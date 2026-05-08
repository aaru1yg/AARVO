import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

const Deals = () => {
  const navigate = useNavigate();
  const { products } = useStore();
  const [dealId, setDealId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    onValue(ref(db, 'settings/dealId'), (snap) => {
      const data = snap.val();
      if (data) setDealId(data);
    });
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProduct = dealId
    ? products.find(p => p.id === dealId)
    : products.find(p => p.originalPrice && p.originalPrice > p.price) || products[0];

  const discount = dealProduct?.originalPrice
    ? Math.round(((dealProduct.originalPrice - dealProduct.price) / dealProduct.originalPrice) * 100)
    : 60;

  return (
    <section className="py-32 bg-[#fafafa]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-black rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="max-w-xl text-center lg:text-left">
              <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                <span className="bg-white text-black px-4 py-1 rounded-full text-xs font-black flex items-center gap-2">
                  <Zap size={14} className="fill-black" /> FLASH SALE
                </span>
                <span className="text-white/60 text-sm flex items-center gap-2">
                  <Clock size={16} /> Ending in:
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
                GET UP TO <br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>
                  {discount}% OFF
                </span>
              </h2>

              <div className="flex gap-4 justify-center lg:justify-start mb-10">
                {[
                  { label: 'HRS', value: timeLeft.hours },
                  { label: 'MIN', value: timeLeft.minutes },
                  { label: 'SEC', value: timeLeft.seconds }
                ].map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-black border border-white/20">
                      {unit.value.toString().padStart(2, '0')}
                    </div>
                    <span className="text-[10px] font-bold mt-2 opacity-60 tracking-widest">{unit.label}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/shop')}
                className="bg-white text-black px-12 py-5 rounded-full font-black hover:bg-gray-200 transition-all shadow-xl">
                SHOP THE DEALS
              </button>
            </div>

            <div className="relative w-full lg:w-1/2 aspect-square max-w-[500px]">
              <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full">
                <img src={dealProduct?.image || '/images/gadget-1.jpg'} alt="Deal"
                  className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(255,255,255,0.2)]" />
              </motion.div>

              {dealProduct && (
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  onClick={() => navigate('/shop')}
                  className="absolute top-0 right-0 w-32 h-32 bg-white text-black rounded-full flex flex-col items-center justify-center -translate-y-1/2 translate-x-1/2 shadow-2xl cursor-pointer">
                  <span className="text-xs font-bold">ONLY</span>
                  <span className="text-2xl font-black">₹{dealProduct.price.toLocaleString('en-IN')}</span>
                  {dealProduct.originalPrice && (
                    <span className="text-[10px] line-through opacity-50">₹{dealProduct.originalPrice}</span>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deals;