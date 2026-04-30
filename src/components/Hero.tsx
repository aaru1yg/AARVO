import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const navigate = useNavigate();

  return (
    <section className="relative h-[110vh] flex items-center overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 2 }}
          className="w-full h-full flex items-center justify-center text-[30vw] font-black text-black select-none pointer-events-none">
          AARU
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div style={{ y: y1, opacity }} className="max-w-2xl text-black">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-2 mb-6">
              <span className="w-12 h-[1px] bg-black"></span>
              <span className="text-xs uppercase tracking-[0.5em] font-bold">Aaru Exclusive</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              CURATING <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px black' }}>EVERYTHING</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              From cutting-edge gadgets to designer apparel. Experience a universe of premium essentials.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6">
              <button
                onClick={() => navigate('/shop')}
                className="bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 group shadow-2xl">
                Discover Collection
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="bg-white border-2 border-black text-black px-10 py-5 rounded-full font-bold hover:bg-black hover:text-white transition-all duration-300">
                Shop All
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative hidden lg:block">
            <div className="relative w-[450px] h-[600px] rounded-[40px] overflow-hidden shadow-2xl">
              <img src="/images/hero-bg.jpg" alt="Luxury Fashion"
                className="w-full h-full object-cover scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-20 bg-white p-6 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold">A</div>
                <div>
                  <h4 className="font-bold text-sm">Exclusive Preview</h4>
                  <p className="text-xs text-gray-500">2026 Collection</p>
                </div>
              </div>
              <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="h-full bg-black" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-10 hidden md:flex items-center gap-4">
        <div className="w-[1px] h-20 bg-black/20 relative">
          <motion.div
            animate={{ height: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-0 w-full bg-black" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] rotate-180 [writing-mode:vertical-lr]">Scroll Down</span>
      </motion.div>
    </section>
  );
};

export default Hero;