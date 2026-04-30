import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { ref, push } from 'firebase/database';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: '',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      alert('Please fill all delivery details!');
      return;
    }
    setPaying(true);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: 'rzp_test_ShfTLgnultLmur',
          amount: total * 100, // in paise
          currency: 'INR',
          name: 'Aaru Store',
          description: `Order of ${cart.length} item(s)`,
          handler: async (response: any) => {
            // Save order to Firebase
            await push(ref(db, 'orders'), {
              items: cart,
              delivery: form,
              total: total,
              paymentId: response.razorpay_payment_id,
              status: 'Paid',
              createdAt: new Date().toISOString(),
            });
            clearCart();
            alert('Payment successful! Order placed.');
            setPaying(false);
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: '#000000' },
          modal: {
            ondismiss: () => setPaying(false),
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      alert('Payment failed. Please try again.');
      setPaying(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter">YOUR CART IS EMPTY</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all inline-block">
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-5xl font-black tracking-tighter mb-12">CHECKOUT</h1>

        <div className="flex flex-col lg:flex-row gap-16">

          {/* Left — Cart + Delivery Form */}
          <div className="flex-1 space-y-8">

            {/* Cart Items */}
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Order Items</h2>
            </div>
            {cart.map((item) => (
              <motion.div key={item.id} layout className="flex gap-6 pb-8 border-b border-gray-50">
                <div className="w-32 h-40 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image || '/images/gadget-1.jpg'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 py-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">{item.category}</p>
                    <p className="text-lg font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center border border-gray-100 rounded-full px-4 py-1 w-fit">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-lg font-bold px-2">-</button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-lg font-bold px-2">+</button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Delivery Form */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 pt-4 border-t border-gray-100">
                Delivery Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'name', placeholder: 'Full Name' },
                  { key: 'email', placeholder: 'Email Address' },
                  { key: 'phone', placeholder: 'Phone Number' },
                  { key: 'pincode', placeholder: 'Pincode' },
                ].map(({ key, placeholder }) => (
                  <input key={key}
                    type="text"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-black transition"
                  />
                ))}
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-black transition"
                />
                <input
                  type="text"
                  placeholder="Full Address"
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-black transition md:col-span-2"
                />
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <aside className="lg:w-[400px]">
            <div className="bg-gray-50 rounded-[2.5rem] p-10 sticky top-32">
              <h2 className="text-xl font-black mb-8 tracking-tight">ORDER SUMMARY</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-bold text-black">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full bg-black text-white px-8 py-5 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group disabled:opacity-50">
                {paying ? 'Processing...' : 'PAY NOW'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8">
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                  SECURE CHECKOUT · RAZORPAY PROTECTED<br />
                  FREE RETURNS WITHIN 7 DAYS
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;