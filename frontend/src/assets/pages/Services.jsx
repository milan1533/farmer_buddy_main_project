import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const seedServices = [
  { id: 's1', title: 'Farming Guidance', desc: 'Seasonal advice, soil testing, pest control and best practices.' },
  { id: 's2', title: 'E-Marketplace', desc: 'List your produce and reach buyers directly.' },
  { id: 's3', title: 'Consultancy', desc: 'One-on-one expert assistance for farm planning and growth.' },
  { id: 's4', title: 'Equipment Rental', desc: 'Rent tractors, sprayers, and tools on demand.' },
];

const Services = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdminUser = user?.role === 'Admin' || user?.role === 'admin';
  const location = useLocation();
  const inAdmin = location.pathname.startsWith('/admin');
  const isAdmin = isAdminUser && inAdmin;

  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('servicesData');
    return stored ? JSON.parse(stored) : seedServices;
  });

  const [form, setForm] = useState({ title: '', desc: '' });

  useEffect(() => {
    localStorage.setItem('servicesData', JSON.stringify(items));
  }, [items]);

  const addService = (e) => {
    e.preventDefault();
    if (!form.title) return;
    const newItem = { id: crypto.randomUUID(), title: form.title, desc: form.desc };
    setItems([newItem, ...items]);
    setForm({ title: '', desc: '' });
  };

  const deleteService = (id) => {
    if (!confirm('Delete this service?')) return;
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 text-center">Services</h1>

        {isAdmin && (
          <form onSubmit={addService} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">Add Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="border rounded px-3 py-2 bg-white dark:bg-gray-700" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
              <input className="border rounded px-3 py-2 bg-white dark:bg-gray-700 md:col-span-2" placeholder="Description" value={form.desc} onChange={(e)=>setForm({...form,desc:e.target.value})} />
            </div>
            <div className="mt-3">
              <button className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Add</button>
            </div>
          </form>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((s) => (
            <div key={s.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow animate-fade-in-up">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{s.desc}</p>
                </div>
                {isAdmin && (
                  <button onClick={()=>deleteService(s.id)} className="text-red-600 hover:text-red-700">Delete</button>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Services;




