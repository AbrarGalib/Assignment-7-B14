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
  const [tickerItems, setTickerItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://api.abcz.workers.dev/api/bazardor/products")
      .then(res => res.json())
      .then(data => setTickerItems(data.slice(0, 8)))
      .catch(err => console.error(err));
  }, []);

  const categories = [
    { name: "চাল", slug: "chal" },
    { name: "ডাল", slug: "dal" },
    { name: "তেল", slug: "oil" },
    { name: "সবজি", slug: "vegetables" },
    { name: "মাছ", slug: "fish" },
    { name: "মাংস", slug: "meat" },
    { name: "ডিম-দুধ", slug: "dairy" },
    { name: "মসলা", slug: "spices" },
  ];

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
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive ? "bg-emerald-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
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
              <span>{item.emoji}</span>
              <span className="font-semibold">{item.name}</span>
              <span>{item.price} টাকা/{item.unit}</span>
              <span className={item.change >= 0 ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>
                {item.change >= 0 ? `▲ ${item.change}%` : `▼ ${Math.abs(item.change)}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}