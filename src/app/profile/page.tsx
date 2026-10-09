"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client"; 

export default function ProfilePage() {
  const router = useRouter();
  
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/signin");
    }
  }, [isPending, user, router]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছেন!");
          router.push("/signin");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
        <p className="mt-4 text-xl font-bold text-gray-700">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!user) return null; 

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img 
            src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"} 
            alt="Profile Avatar" 
            className="w-32 h-32 rounded-full object-cover border-4 border-emerald-50"
          />
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold">
              <span>✓</span> ভেরিফাইড অ্যাকাউন্ট
            </div>
          </div>
          <div>
            <button 
              onClick={handleSignOut}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-3 rounded-xl font-semibold transition"
            >
              সাইন আউট
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">আমার পছন্দের তালিকা</h3>
          <p className="text-gray-500 text-sm">আপনি এখনও কোনো পণ্য পছন্দের তালিকায় যুক্ত করেননি।</p>
          <Link href="/" className="inline-block mt-4 text-emerald-600 font-semibold hover:underline">
            বাজার দর দেখুন →
          </Link>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">অ্যাকাউন্ট সেটিংস</h3>
          <p className="text-gray-500 text-sm mb-6">আপনার অ্যাকাউন্টের তথ্যাদি আপডেট করুন।</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* THIS IS THE NEW UPDATE BUTTON LINKING TO THE NEW ROUTE */}
            <Link 
              href="/profile/update" 
              className="text-center text-sm font-semibold bg-emerald-600 text-white rounded-xl px-4 py-2.5 hover:bg-emerald-700 transition"
            >
              তথ্য আপডেট করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}