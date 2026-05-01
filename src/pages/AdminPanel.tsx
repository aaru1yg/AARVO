'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { Plus, Trash2, Edit3, LayoutDashboard, Package, ShoppingCart as OrderIcon, Shield } from 'lucide-react';

const ADMIN_EMAIL = 'muslim103531@gmail.com';

const BADGES = [
  { id: 'hot', label: 'HOT', color: 'bg-red-500' },
  { id: 'new', label: 'NEW', color: 'bg-blue-500' },
  { id: 'sale', label: 'SALE', color: 'bg-orange-500' },
  { id: 'limited', label: 'LIMITED', color: 'bg-yellow-500' },
  { id: 'bestseller', label: 'BEST', color: 'bg-purple-500' },
];

const emptyForm = {
  name: '', price: '', originalPrice: '',
  category: 'gadgets', description: '',
  image: '', stock: '', badge: '',
  cod: false, freeDelivery: false, deliveryCharge: '99',
};

export default function AdminPanel() {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  useEffect(() => {
    onValue(ref(db, 'orders'), (snap) => {
      const data = snap.val();
      setOrders(data ? Object.entries(data).map(([id, val]: any) => ({ id, ...val })) : []);
    });
  }, []);

  const handleLogin = () => {
    if (password === 'Aaru@9k2#2026!') setIsAdmin(true);
    else alert('Wrong password!');
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_upload');
    formData.append('cloud_name', 'dnw1xppms');
    const res = await fetch('https://api.cloudinary.com/v1_1/dnw1xppms/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadToCloudinary(file);
        imageUrls.push(url);
      }
      if (form.image) imageUrls.unshift(form.image);

      const productData = {
        name: form.name,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        category: form.category,
        description: form.description,
        stock: form.stock ? Number(form.stock) : null,
        badge: form.badge || null,
        image: imageUrls[0] || '',
        images: imageUrls,
        cod: form.cod,
        freeDelivery: form.freeDelivery,
        deliveryCharge: form.freeDelivery ? 0 : Number(form.deliveryCharge || 99),
        createdAt: new Date().toISOString(),
      };

      if (editingId) {
        await update(ref(db, `products/${editingId}`), productData);
        setEditingId(null);
        alert('Product updated!');
      } else {
        await push(ref(db, 'products'), productData);
        alert('Product added!');
      }
      setForm(emptyForm);
      setImageFiles([]);
      setImagePreview([]);
      setActiveTab('products');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
    setUploading(false);
  };

  const handleEdit = (p: any) => {
    setForm({
      name: p.name, price: p.price, originalPrice: p.originalPrice || '',
      category: p.category, description: p.description || '',
      image: p.image || '', stock: p.stock || '', badge: p.badge || '',
      cod: p.cod || false, freeDelivery: p.freeDelivery || false,
      deliveryCharge: p.deliveryCharge || '99',
    });
    setEditingId(p.id);
    setActiveTab('add');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await remove(ref(db, `products/${id}`));
  };

  const handleGlobalCOD = async (enabled: boolean) => {
    for (const p of products) {
      await update(ref(db, `products/${p.id}`), { cod: enabled });
    }
    alert(`COD ${enabled ? 'enabled' : 'disabled'} for all products!`);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 7 - imageFiles.length;
    const toAdd = files.slice(0, remaining);
    setImageFiles(prev => [...prev, ...toAdd]);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  if (!isAdmin) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-xl w-full max-w-md text-center">
          <Shield size={48} className="mx-auto mb-6 text-black" />
          <h2 className="text-3xl font-black mb-2">Admin Access</h2>
          <p className="text-gray-400 mb-8 text-sm">Enter admin password to continue</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border border-gray-200 rounded-2xl px-6 py-4 mb-4 focus:outline-none focus:border-black" />
          <button onClick={handleLogin}
            className="w-full bg-black text-white py-4 rounded-full font-black hover:bg-gray-800 transition">
            Enter Admin
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 space-y-2">
            <h2 className="text-2xl font-black mb-8 px-4">ADMIN</h2>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
              { id: 'products', label: 'Products', icon: <Package size={18} /> },
              { id: 'add', label: editingId ? 'Edit Product' : 'Add Product', icon: <Plus size={18} /> },
              { id: 'orders', label: 'Orders', icon: <OrderIcon size={18} /> },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id ? 'bg-black text-white shadow-xl' : 'hover:bg-white text-gray-500'
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">

              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div>
                  <h3 className="text-3xl font-black mb-8">Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      { label: 'Total Revenue', value: `₹${revenue.toLocaleString('en-IN')}`, color: 'bg-blue-50' },
                      { label: 'Total Orders', value: orders.length, color: 'bg-green-50' },
                      { label: 'Total Products', value: products.length, color: 'bg-purple-50' },
                    ].map(stat => (
                      <div key={stat.label} className={`${stat.color} p-8 rounded-[2rem]`}>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <p className="text-3xl font-black">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Global COD */}
                  <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="font-black">Cash on Delivery — All Products</p>
                      <p className="text-sm text-gray-400 mt-1">Enable or disable COD for every product at once</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleGlobalCOD(true)}
                        className="bg-green-500 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-green-600 transition">
                        Enable All
                      </button>
                      <button onClick={() => handleGlobalCOD(false)}
                        className="bg-red-500 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-red-600 transition">
                        Disable All
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products List */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black">Products</h3>
                    <button onClick={() => { setForm(emptyForm); setEditingId(null); setActiveTab('add'); }}
                      className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition">
                      <Plus size={18} /> Add Product
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                          <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                          <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">COD</th>
                          <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery</th>
                          <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.map(p => (
                          <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                  {p.image && <img src={p.image} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                  <p className="font-bold">{p.name}</p>
                                  <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <p className="font-bold">₹{p.price.toLocaleString('en-IN')}</p>
                              {p.originalPrice && <p className="text-xs text-gray-400 line-through">₹{p.originalPrice}</p>}
                            </td>
                            <td className="py-4">
                              <button onClick={() => update(ref(db, `products/${p.id}`), { cod: !p.cod })}
                                className={`text-xs font-bold px-3 py-1 rounded-full ${p.cod ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                {p.cod ? 'ON' : 'OFF'}
                              </button>
                            </td>
                            <td className="py-4">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.freeDelivery ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                {p.freeDelivery ? 'Free' : `₹${p.deliveryCharge || 99}`}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(p)}
                                  className="p-2 hover:bg-black hover:text-white rounded-lg transition">
                                  <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(p.id)}
                                  className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition text-red-500">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add/Edit Product */}
              {activeTab === 'add' && (
                <form onSubmit={handleAddProduct} className="max-w-2xl flex flex-col gap-5">
                  <h3 className="text-3xl font-black">{editingId ? 'Edit Product' : 'Add Product'}</h3>

                  <div>
                    <label className="text-sm font-bold text-gray-400 mb-1 block">Product Name</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="iPhone 15" required
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-black" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-gray-400 mb-1 block">Sale Price (₹)</label>
                      <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                        placeholder="999" required
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-400 mb-1 block">Original Price (₹)</label>
                      <input type="number" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))}
                        placeholder="1499 optional"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-black" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-400 mb-1 block">Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-black">
                      <option value="gadgets">Gadgets</option>
                      <option value="clothes">Clothes</option>
                      <option value="general">General</option>
                      <option value="watches">Watches</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-400 mb-2 block">Badge</label>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => setForm(p => ({ ...p, badge: '' }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${!form.badge ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500'}`}>
                        None
                      </button>
                      {BADGES.map(badge => (
                        <button key={badge.id} type="button" onClick={() => setForm(p => ({ ...p, badge: badge.id }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${form.badge === badge.id ? `${badge.color} text-white` : 'border border-gray-200 text-gray-500'}`}>
                          {badge.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-400 mb-1 block">Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                      placeholder="50 optional"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-black" />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-400 mb-1 block">Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Product description..." rows={3}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-black resize-none" />
                  </div>

                  {/* Delivery Settings */}
                  <div className="bg-gray-50 rounded-2xl p-5 flex flex-col gap-3">
                    <p className="font-black">Delivery Settings</p>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.freeDelivery}
                        onChange={e => setForm(p => ({ ...p, freeDelivery: e.target.checked }))}
                        className="w-4 h-4 accent-black" />
                      <span className="font-bold text-sm">Free Delivery</span>
                    </label>
                    {!form.freeDelivery && (
                      <div>
                        <label className="text-sm font-bold text-gray-400 mb-1 block">Delivery Charge (₹)</label>
                        <input type="number" value={form.deliveryCharge}
                          onChange={e => setForm(p => ({ ...p, deliveryCharge: e.target.value }))}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-black" />
                        <p className="text-xs mt-1 text-orange-500">Delivery charges are non-refundable</p>
                      </div>
                    )}
                  </div>

                  {/* COD Toggle */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.cod}
                        onChange={e => setForm(p => ({ ...p, cod: e.target.checked }))}
                        className="w-4 h-4 accent-black" />
                      <div>
                        <p className="font-black text-sm">Enable Cash on Delivery</p>
                        <p className="text-xs text-gray-400 mt-0.5">Customer can pay cash on delivery</p>
                      </div>
                    </label>
                  </div>

                  {/* Images — up to 7 */}
                  <div>
                    <label className="text-sm font-bold text-gray-400 mb-2 block">
                      Product Photos (up to 7)
                    </label>
                    {imagePreview.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-3">
                        {imagePreview.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img} className="w-16 h-16 object-cover rounded-xl" />
                            {idx === 0 && (
                              <span className="absolute -top-1 -left-1 bg-black text-white text-xs font-black px-1 rounded">Main</span>
                            )}
                            <button type="button"
                              onClick={() => {
                                setImageFiles(prev => prev.filter((_, i) => i !== idx));
                                setImagePreview(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs font-black flex items-center justify-center">
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {imageFiles.length < 7 && (
                      <input type="file" accept="image/*" multiple onChange={handleImageChange}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-500" />
                    )}
                    <p className="text-xs mt-1 text-gray-400">{imageFiles.length}/7 photos. First is main photo.</p>
                  </div>

                  <button type="submit" disabled={uploading}
                    className="w-full bg-black text-white font-black py-4 rounded-full hover:bg-gray-800 transition disabled:opacity-50">
                    {uploading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                  </button>

                  {editingId && (
                    <button type="button"
                      onClick={() => { setEditingId(null); setForm(emptyForm); setActiveTab('products'); }}
                      className="w-full border border-gray-200 text-gray-500 font-bold py-3 rounded-full hover:border-black transition">
                      Cancel Edit
                    </button>
                  )}
                </form>
              )}

              {/* Orders */}
              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-3xl font-black mb-8">Orders</h3>
                  {orders.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No orders yet</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.map((order, i) => (
                        <div key={order.id} className="border border-gray-100 rounded-2xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-black">{order.delivery?.name}</p>
                              <p className="text-sm text-gray-400">{order.delivery?.email}</p>
                              <p className="text-xs text-gray-400 mt-1">{order.delivery?.address}, {order.delivery?.city}</p>
                              <p className="text-xs font-mono text-gray-400 mt-1">{order.paymentId}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-xl">₹{order.total?.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>{order.status}</span>
                            <select onChange={e => update(ref(db, `orders/${order.id}`), { status: e.target.value })}
                              defaultValue={order.status}
                              className="text-sm border border-gray-200 rounded-full px-3 py-1 focus:outline-none focus:border-black">
                              <option value="Paid">Paid</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}