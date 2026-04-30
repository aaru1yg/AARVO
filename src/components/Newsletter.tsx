
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  return (
    <section className="py-24 bg-black text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Join the Aarov Club
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-10"
          >
            Subscribe to receive updates, access to exclusive deals, and more. <br className="hidden md:block" />
            Get 15% off your first order when you sign up.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 focus:outline-none focus:border-white transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Subscribe
              <Send size={18} />
            </button>
          </motion.form>
          <p className="mt-6 text-xs text-gray-500">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
