"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client"; 

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Protect route and pre-fill the form with current name
  useEffect(() => {
    if (!isPending && !user) {
      router.push("/signin");
    } else if (user) {
      setName(user.name || "");
    }
  }, [isPending, user, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না!");
      return;
    }

    setLoading(true);

    // Call Better Auth to update the user's name
    await authClient.updateUser({
      name: name,
    }, {
      onSuccess: () => {
        toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
        router.push("/profile");
        router.refresh(); // Refresh to update the navbar and profile UI with the new name
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "তথ্য আপডেট করতে সমস্যা হয়েছে।");
        setLoading(false);
      }
    });
  };

  if (isPending) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-6">
        
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <Link href="/profile" className="text-gray-400 hover:text-gray-800 transition text-xl">
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">তথ্য আপডেট করুন</h1>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required 
            />
            <p className="text-xs text-gray-400 mt-2">এই নামটি আপনার প্রোফাইল এবং নেভিগেশন বারে দেখানো হবে।</p>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || name === user.name} // Disable if loading or name hasn't changed
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold shadow transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "আপডেট হচ্ছে..." : "Update Information"}
          </button>
        </form>
      </div>
    </div>
  );
}