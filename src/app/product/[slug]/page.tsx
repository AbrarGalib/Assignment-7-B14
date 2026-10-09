"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById } from "@/services/api";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Authentication Guard
  useEffect(() => {
    if (!isPending && !user) {
      toast.warning("বিস্তারিত দেখতে প্রথমে লগইন করুন!");
      router.push("/signin");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (slug) {
      fetchProductById(slug as string)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (isPending || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
        <p className="mt-4 text-xl font-bold text-gray-700">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!user) return null;
  if (!product) return <div className="text-center py-24">পণ্য পাওয়া যায়নি</div>;

  const allMins = product.markets?.map((m: any) => m.min) || [product.today];
  const allMaxs = product.markets?.map((m: any) => m.max) || [product.today];
  const overallMin = Math.min(...allMins);
  const overallMax = Math.max(...allMaxs);
  const overallAvg = Math.round((overallMin + overallMax) / 2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl bg-gray-50 p-4 rounded-2xl">{product.image}</span>
          <div>
            <h1 className="text-3xl font-bold">{product.nameBn}</h1>
            <p className="text-gray-500">প্রতি {product.unit} · {product.categoryNameBn}</p>
          </div>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs text-gray-400 block">আজকের গড় দাম</span>
          <span className="text-2xl font-bold text-emerald-600">{product.today} টাকা</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
          <p className="text-2xl font-bold text-emerald-600">{overallMin} টাকা</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500">সর্বাধিক দাম</p>
          <p className="text-2xl font-bold text-red-600">{overallMax} টাকা</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-500">গড় দাম</p>
          <p className="text-2xl font-bold text-gray-900">{overallAvg} টাকা</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-4">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="py-3">বাজার</th>
                <th className="py-3">বিভাগ</th>
                <th className="py-3">সর্বনিম্ন</th>
                <th className="py-3">সর্বাধিক</th>
                <th className="py-3">গড়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {product.markets?.map((b: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-3 font-medium">{b.market}</td>
                  <td className="py-3 text-gray-500">{b.division}</td>
                  <td className="py-3">{b.min} টাকা</td>
                  <td className="py-3">{b.max} টাকা</td>
                  <td className="py-3 font-bold">{Math.round((b.min + b.max) / 2)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}