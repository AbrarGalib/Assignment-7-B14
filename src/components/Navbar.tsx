"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>({
    name: "Rezwan Ahmed",
    email: "rezwanahmed@gmail.com"
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tickerItems, setTickerItems] = useState<any[]>([]);

  useEffect(() => {
    // 2. Fetch the products for the ticker
    fetch("https://api.abcz.workers.dev/api/bazardor/products")
      .then(res => res.json())
      .then(data => setTickerItems(data.slice(0, 8)))
      .catch(err => console.error(err));

    // 3. Fetch the real categories from the API!
    fetch("https://api.abcz.workers.dev/api/bazardor/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);



  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white p-2 rounded-xl text-xl">🛒</div>
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900">বাজার দর</Link>
            <p className="text-xs text-gray-500">মঙ্গলবার, ৬ অক্টোবর, ২০২৬</p>
          </div>
        </div>

        {/* Auth / Profile Section */}
        <div className="relative">
          {user ? (
            <div>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 font-medium text-gray-800 hover:text-emerald-600"
              >
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                <span>{user.name}</span>
                <span>▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 z-50">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 mb-3">{user.email}</p>
                  <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-700 py-2 hover:text-emerald-600">
                    👤 আমার প্রোফাইল
                  </Link>
                  <button onClick={() => setUser(null)} className="w-full text-left text-sm text-red-600 py-2 hover:bg-red-50 rounded px-1">
                    ↩ সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/signin" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600">সাইন ইন</Link>
              <Link href="/signup" className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700">সাইন আপ</Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation Links */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link 
                key={cat.slug} 
                href={`/category/${cat.slug}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive ? "bg-emerald-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.nameBn}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Price Ticker Marquee */}
      <div className="bg-gray-50 border-t border-b border-gray-200 py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee gap-8 text-sm text-gray-700">
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3">
              <span>{item.image}</span>
              <span className="font-semibold">{item.nameBn}</span>
              <span>{item.today} টাকা/{item.unit}</span>
              <span className={item.change?.dir === 'up' ? "text-red-600 font-bold" : item.change?.dir === 'down' ? "text-emerald-600 font-bold" : "text-gray-500 font-bold"}>
                {item.change?.dir === 'up' ? `▲ ${item.change.pct}%` : item.change?.dir === 'down' ? `▼ ${item.change.pct}%` : `— ${item.change?.pct || 0}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}