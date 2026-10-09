"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client"; 

export default function ProfilePage() {
  const router = useRouter();
  
  // Fetch user session
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // State for the update form
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  // Protect route & set initial name value
  useEffect(() => {
    if (!isPending && !user) {
      router.push("/signin");
    } else if (user && !name) {
      setName(user.name || "");
    }
  }, [isPending, user, router, name]);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না!");
      return;
    }

    setUpdating(true);

    await authClient.updateUser({
      name: name,
    }, {
      onSuccess: () => {
        toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
        router.refresh();
        setUpdating(false);
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "তথ্য আপডেট করতে সমস্যা হয়েছে।");
        setUpdating(false);
      }
    });
  };

  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null; 

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-gray-500 text-sm mt-1">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <img 
              src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
              alt="Profile Avatar" 
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="border border-red-500 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl font-medium transition flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <span>↩</span> সাইন আউট
          </button>
        </div>

        {/* Update Information Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">তথ্য</h3>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">নাম</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={updating || name === user.name}
              className="w-full bg-[#0a8b44] hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}