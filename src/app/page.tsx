"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts } from "@/services/api";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter based on the API's 'dir' property
  const risers = products.filter(p => p.change?.dir === 'up').slice(0, 6);
  const fallers = products.filter(p => p.change?.dir === 'down').slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-6 max-w-xl">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">আজকের বাজার</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">আজকের বাজারের দাম এক নজরে</h1>
          <p className="text-gray-600 text-lg">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন, সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
          <button 
            onClick={() => document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-2xl shadow transition"
          >
            সব পণ্য দেখুন
          </button>
        </div>
        
        {/* Added Hero Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img 
            src="/assets/bazar-hero.png" 
            alt="বাজার দর" 
            className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain drop-shadow-sm"
          />
        </div>
      </div>

      {/* Top Risers Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-red-600">▲</span> আজ দাম বেড়েছে
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {risers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Top Fallers Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-emerald-600">▼</span> আজ দাম কমেছে
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* All Products Grid */}
      <section id="all-products" className="space-y-6 pt-6 border-t border-gray-200">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">সব পণ্য</h2>
          <p className="text-gray-500">বাজারের সমস্ত নিত্যপ্রয়োজনীয় পণ্যের তালিকা ও আজকের দর</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-gray-100 animate-pulse h-48 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.id}`} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl bg-gray-50 p-3 rounded-2xl">{product.image || "📦"}</span>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{product.nameBn}</h3>
          <p className="text-sm text-gray-500">প্রতি {product.unit || "kg"}</p>
        </div>
      </div>
      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
        <div>
          <span className="text-xs text-gray-400 block">আজকের দাম</span>
          <span className="text-xl font-bold text-gray-900">{product.today} টাকা</span>
        </div>
        <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${
          product.change?.dir === 'up' ? "bg-red-50 text-red-600" : product.change?.dir === 'down' ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"
        }`}>
          {product.change?.dir === 'up' ? `▲ ${product.change.pct}%` : product.change?.dir === 'down' ? `▼ ${product.change.pct}%` : `— ${product.change?.pct || 0}%`}
        </span>
      </div>
    </Link>
  );
}