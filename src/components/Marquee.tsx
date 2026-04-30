import { motion } from 'framer-motion';

const Marquee = () => {
  const items = ["PREMIUM QUALITY", "FREE SHIPPING WORLDWIDE", "24/7 CUSTOMER SUPPORT", "SECURE PAYMENTS", "EXQUISITE DESIGN"];
  
  return (
    <div className="bg-black py-4 overflow-hidden whitespace-nowrap border-y border-white/10">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-20 items-center"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-20 items-center">
            {items.map((item) => (
              <span key={item} className="text-white text-xs font-bold tracking-[0.4em] flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {item}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
