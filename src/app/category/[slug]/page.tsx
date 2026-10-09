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

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-to-high") return Number(a.price) - Number(b.price);
    if (sortOrder === "high-to-low") return Number(b.price) - Number(a.price);
    return 0;
  });

  if (loading) return <div className="text-center py-24 text-xl">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold capitalize text-gray-900">{slug}</h1>
          <p className="text-gray-500">{products.length}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      <div className="flex justify-end items-center gap-2">
        <span className="text-sm text-gray-600">সাজান:</span>
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm bg-white shadow-sm"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low-to-high">দাম: কম থেকে বেশি</option>
          <option value="high-to-low">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
          <h3 className="text-2xl font-bold mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
          <Link href="/" className="mt-4 inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl">হোম পেজে ফিরে যান</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedProducts.map(p => (
            <Link key={p.id} href={`/product/${p.id}`} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-xl font-bold text-emerald-600 mt-2">{p.price} টাকা</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}