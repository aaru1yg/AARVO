import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, Product } from '../store/useStore';
import { Plus, Trash2, Edit3, Save, X, LayoutDashboard, Package, ShoppingCart as OrderIcon } from 'lucide-react';

const AdminPanel = () => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState('products');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Admin Sidebar */}
          <aside className="lg:w-64 space-y-2">
            <h2 className="text-2xl font-black mb-8 px-4">ADMIN</h2>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-black text-white shadow-xl' : 'hover:bg-white text-gray-500'}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-black text-white shadow-xl' : 'hover:bg-white text-gray-500'}`}
            >
              <Package size={18} /> Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-black text-white shadow-xl' : 'hover:bg-white text-gray-500'}`}
            >
              <OrderIcon size={18} /> Orders
            </button>
          </aside>

          {/* Admin Content */}
          <main className="flex-1">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black capitalize tracking-tight">{activeTab}</h3>
                {activeTab === 'products' && (
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
                  >
                    <Plus size={18} /> Add Product
                  </button>
                )}
              </div>

              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Revenue', value: '₹12,45,000', color: 'bg-blue-50' },
                    { label: 'Active Orders', value: '24', color: 'bg-green-50' },
                    { label: 'Total Products', value: products.length.toString(), color: 'bg-purple-50' }
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.color} p-8 rounded-[2rem] border border-white`}>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                      <p className="text-3xl font-black">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((p) => (
                        <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                <img src={p.image} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-bold">{p.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-500">{p.category}</td>
                          <td className="py-4 font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-colors"><Edit3 size={16} /></button>
                              <button className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-red-500"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-20 text-gray-400">
                  <p>No new orders today.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
