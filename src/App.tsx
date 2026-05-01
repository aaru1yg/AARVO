import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Marquee from './components/Marquee';
import ParallaxSection from './components/ParallaxSection';
import Trending from './components/Trending';
import Deals from './components/Deals';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const HomePage = () => (
  <>
    <Hero />
    <Deals />
    <Marquee />
    <FeaturedProducts />
    <ParallaxSection />
    <Trending />
    <Categories />
    <Newsletter />
  </>
);

const ShopPageWrapper = () => {
  const { pathname } = useLocation();
  const category = pathname.split('/').pop()?.replace('-', ' ');
  return <ShopPage initialCategory={category} />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white selection:bg-black selection:text-white">
        <Navbar />

        {/* Floating Offer Badge */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2, type: "spring" }}
          className="fixed bottom-10 right-10 z-[80] hidden lg:block pointer-events-none"
        >
          <div className="bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-black">
              -60%
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Limited Offer</p>
              <p className="font-bold">Flash Sale is Live</p>
            </div>
          </div>
        </motion.div>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/category/:cat" element={<ShopPageWrapper />} />
            <Route path="/x9k2-dashboard" element={<AdminPanel />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
