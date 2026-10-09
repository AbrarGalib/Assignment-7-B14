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
      toast.warning("প্রোফাইল দেখতে প্রথমে লগইন করুন!");
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

  if (isPending) return <div className="text-center py-24">লোড হচ্ছে...</div>;
  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-gray-500 text-sm mt-1">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <img 
              src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
              alt="Avatar" 
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="border border-red-500 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl font-medium transition flex items-center gap-2 text-sm"
          >
            <span>↩</span> সাইন আউট
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">তথ্য পরিবর্তন</h3>
            <p className="text-gray-500 text-sm">নাম এবং ব্যক্তিগত তথ্য আপডেট করুন।</p>
          </div>
          <Link 
            href="/profile/update" 
            className="bg-[#0a8b44] hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition"
          >
            তথ্য আপডেট করুন
          </Link>
        </div>
      </div>
    </div>
  );
}