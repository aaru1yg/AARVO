import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const ParallaxSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative h-[60vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/lifestyle-parallax.jpg"
          alt="Lifestyle"
          className="w-full h-[140%] object-cover brightness-75"
        />
      </motion.div>
      <div className="relative z-10 text-center text-white px-4">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-black tracking-tighter mb-6"
        >
          ESSENCE OF MODERNITY
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mx-auto text-white/80"
        >
          We believe in the beauty of simplicity and the power of detail.
        </motion.p>
      </div>
    </section>
  );
};

export default ParallaxSection;
