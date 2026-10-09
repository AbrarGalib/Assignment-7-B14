"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProducts } from "@/services/api";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>("default");

  useEffect(() => {
    fetchProducts(slug as string)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Sort logic based on the updated 'today' property from the API
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-to-high") return Number(a.today) - Number(b.today);
    if (sortOrder === "high-to-low") return Number(b.today) - Number(a.today);
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
        <p className="mt-4 text-xl font-bold text-gray-700">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Category Header */}
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold capitalize text-gray-900">{slug === 'chal' ? 'চাল' : slug}</h1>
          <p className="text-gray-500 mt-1">{products.length}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      {/* Sorting Control */}
      <div className="flex justify-end items-center gap-2">
        <span className="text-sm font-medium text-gray-700">সাজান:</span>
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low-to-high">দাম: কম থেকে বেশি</option>
          <option value="high-to-low">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      {/* Product Grid / Empty State */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
          <p className="text-gray-500 mb-6">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্যের তথ্য নেই।</p>
          <Link href="/" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map(p => (
            <Link key={p.id} href={`/product/${p.id}`} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl bg-gray-50 p-3 rounded-2xl">{p.image || "📦"}</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{p.nameBn}</h3>
                  <p className="text-sm text-gray-500">প্রতি {p.unit || "kg"}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <div>
                  <span className="text-xs text-gray-400 block">আজকের দাম</span>
                  <span className="text-xl font-bold text-gray-900">{p.today} টাকা</span>
                </div>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${
                  p.change?.dir === 'up' ? "bg-red-50 text-red-600" : p.change?.dir === 'down' ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"
                }`}>
                  {p.change?.dir === 'up' ? `▲ ${p.change.pct}%` : p.change?.dir === 'down' ? `▼ ${p.change.pct}%` : `— ${p.change?.pct || 0}%`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}