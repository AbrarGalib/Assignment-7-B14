"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { authClient } from "@/lib/auth-client"; 
import { toast } from "react-toastify";

// 1. Navbar Content logic
function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [tickerItems, setTickerItems] = useState<any[]>([]);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user; 

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("https://api.abcz.workers.dev/api/bazardor/products")
      .then(res => res.json())
      .then(data => setTickerItems(data.slice(0, 8)))
      .catch(err => console.error(err));

    fetch("https://api.abcz.workers.dev/api/bazardor/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছেন!");
          setDropdownOpen(false);
          router.push("/signin");
        },
      },
    });
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* FIXED LOGO: Rich Green App-Icon Container Styled Exactly Like Image 10 */}
          <Link href="/" className="shrink-0 flex items-center justify-center bg-[#058c42] w-12 h-12 rounded-[12px] shadow-sm hover:opacity-90 transition p-2">
            <img 
              src="/assets/logo-icon.png" 
              alt="বাজার দর" 
              className="w-full h-full object-contain"
            />
          </Link>
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900 leading-tight block">বাজার দর</Link>
            <p className="text-[11px] text-gray-500">মঙ্গলবার, ৬ অক্টোবর, ২০২৬</p>
          </div>
        </div>

        {/* Auth / Profile Section */}
        <div className="relative" ref={dropdownRef}>
          {isPending ? (
            <div className="animate-pulse bg-gray-100 h-10 w-32 rounded-full"></div>
          ) : user ? (
            <div>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 font-medium text-gray-800 hover:text-gray-600 transition"
              >
                <img 
                  src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                  alt="avatar" 
                  className="w-9 h-9 rounded-full object-cover border border-gray-200" 
                />
                <span className="text-sm">{user.name?.split(" ")[0]}</span>
                <span className="text-xs text-gray-400">▾</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 z-50">
                  <div className="mb-5">
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="space-y-4">
                    <Link 
                      href="/profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#058c42] transition"
                    >
                      <span className="text-blue-500 text-lg">👤</span> আমার প্রোফাইল
                    </Link>
                    <button 
                      onClick={handleSignOut} 
                      className="w-full text-left flex items-center gap-3 text-sm font-medium text-red-500 hover:text-red-600 transition"
                    >
                      <span className="text-lg">↩</span> সাইন আউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/signin" className="text-sm font-semibold text-gray-700 hover:text-[#058c42] transition">সাইন ইন</Link>
              <Link href="/signup" className="px-5 py-2 text-sm font-semibold bg-[#058c42] text-white rounded-xl shadow-sm hover:bg-emerald-700 transition">সাইন আপ</Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation Links */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-8 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link 
                key={cat.slug} 
                href={`/category/${cat.slug}`}
                className={`text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive ? "text-[#058c42]" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="opacity-90">{cat.icon}</span>
                {cat.nameBn}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Price Ticker Marquee */}
      <div className="bg-gray-50/80 border-t border-b border-gray-200 py-2.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee gap-8 text-sm">
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-4">
              <span className="opacity-90">{item.image}</span>
              <span className="font-semibold text-gray-700">{item.nameBn}</span>
              <span className="text-gray-600">{item.today} টাকা/{item.unit === 'kg' ? 'কেজি' : item.unit}</span>
              <span className={item.change?.dir === 'up' ? "text-red-500 font-bold" : item.change?.dir === 'down' ? "text-[#058c42] font-bold" : "text-gray-500 font-bold"}>
                {item.change?.dir === 'up' ? `▲ ${item.change.pct}%` : item.change?.dir === 'down' ? `▼ ${item.change.pct}%` : `— ${item.change?.pct || 0}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

// 2. Wrap the export in Suspense to prevent build-time pre-render issues
export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-32 bg-white border-b border-gray-200 animate-pulse"></div>}>
      <NavbarContent />
    </Suspense>
  );
}