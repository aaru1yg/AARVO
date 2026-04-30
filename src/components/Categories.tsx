import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: "Tech & Gadgets", image: "/images/gadget-1.jpg", cat: "gadgets", size: "col-span-1 md:col-span-2" },
  { name: "Home Decor", image: "/images/lifestyle-parallax.jpg", cat: "general", size: "col-span-1" },
  { name: "Clothes", image: "/images/cat-men.jpg", cat: "clothes", size: "col-span-1" },
  { name: "Accessories", image: "/images/cat-accessories.jpg", cat: "general", size: "col-span-1" },
  { name: "Smart Home", image: "/images/gadget-1.jpg", cat: "gadgets", size: "col-span-1 md:col-span-2" },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section id="categories" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4">
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto">
            Discover our curated collections tailored for every style and occasion.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[500px]">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              onClick={() => navigate('/shop')}
              className={`relative overflow-hidden rounded-[2.5rem] group ${cat.size} shadow-xl cursor-pointer`}>
              <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-[1.5s] ease-out">
                <img src={cat.image} alt={cat.name}
                  className="w-full h-full object-cover brightness-[0.85] group-hover:brightness-100 transition-all duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                <span className="text-[10px] uppercase font-bold tracking-[0.5em] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Limited Series
                </span>
                <h3 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">{cat.name}</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-fit bg-white text-black px-10 py-4 rounded-full text-sm font-bold opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                  Shop Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;