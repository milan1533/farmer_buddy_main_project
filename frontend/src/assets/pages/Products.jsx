import React, { useState } from 'react';

const tabs = [
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'grains', label: 'Grains' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'fertilizers', label: 'Fertilizers' },
  { id: 'equipment', label: 'Equipment' },
];

const Products = () => {
  const [active, setActive] = useState('vegetables');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pname, setPname] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const user = JSON.parse(raw);
        setIsAdmin(user?.role === 'Admin');
      }
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : '');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', pname);
    form.append('price', price);
    if (image) form.append('image', image);
    alert('Demo submit: ' + JSON.stringify({ name: pname, price, hasImage: !!image }));
    setPname('');
    setPrice('');
    setImage(null);
    setPreview('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <main className="container mx-auto px-4 pb-12 pt-28">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 text-center">Products & Crops</h1>

        {isAdmin && (
          <section className="mb-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Admin: Add Product</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Name</label>
                  <input value={pname} onChange={(e) => setPname(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Price</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Image</label>
                  <input type="file" accept="image/*" onChange={onFile} />
                </div>
                {preview && (
                  <div className="mt-2">
                    <img src={preview} alt="Preview" className="h-28 w-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                  </div>
                )}
              </div>
              <div>
                <button type="submit" className="inline-flex items-center rounded-md bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700">Save Product</button>
              </div>
            </form>
          </section>
        )}

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-300 ${active === t.id
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="h-36 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{active} item {i + 1}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">High quality, farm-tested and trusted by growers.</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Products;





