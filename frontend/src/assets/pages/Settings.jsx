import React, { useEffect, useState } from 'react';
import api from '../api/api';
import LanguageSwitcher from '../Components/LanguageSwitcher';

export default function Settings() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.location?.address || '',
        city: user.location?.city || '',
        zipCode: user.location?.zipCode || ''
      });
    }
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const payload = { userId: user?._id, ...form };
      const res = await api.put('/auth/update-profile', payload);
      if (res.data?.success) {
        const updated = res.data.user;
        localStorage.setItem('user', JSON.stringify(updated));
        setMessage('Profile updated successfully');
      } else {
        setMessage(res.data?.message || 'Failed to update');
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <h3 className="font-medium mb-3">Profile</h3>
        {message && (
          <div className="mb-3 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">{message}</div>
        )}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Name</label>
            <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <input name="phone" value={form.phone} onChange={onChange} className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>
          <div>
            <label className="text-sm">Address</label>
            <input name="address" value={form.address} onChange={onChange} className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>
          <div>
            <label className="text-sm">City</label>
            <input name="city" value={form.city} onChange={onChange} className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>
          <div>
            <label className="text-sm">ZIP Code</label>
            <input name="zipCode" value={form.zipCode} onChange={onChange} className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>
          <div className="md:col-span-2">
            <button disabled={saving} className="inline-flex items-center rounded-md bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <h3 className="font-medium mb-2">Language</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Choose your preferred language for the website interface (Gujarati, Hindi, English, Tamil, Telugu, Kannada, Malayalam).
        </p>
        <div className="mb-3">
          <LanguageSwitcher />
        </div>
        <div id="google_translate_element"></div>
      </div>
    </div>
  );
}
