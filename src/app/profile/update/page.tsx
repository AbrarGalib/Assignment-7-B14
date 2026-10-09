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
  const [updating, setUpdating] = useState(false);

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

    setUpdating(true);
    await authClient.updateUser({
      name: name,
    }, {
      onSuccess: () => {
        toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
        router.push("/profile");
        router.refresh();
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "আপডেট ব্যর্থ হয়েছে।");
        setUpdating(false);
      }
    });
  };

  if (isPending || !user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-md mx-auto px-4 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <Link href="/profile" className="text-gray-400 hover:text-gray-800 text-xl">←</Link>
          <h1 className="text-xl font-bold text-gray-900">তথ্য আপডেট</h1>
        </div>

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
            className="w-full bg-[#0a8b44] hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-300 disabled:text-gray-500"
          >
            {updating ? "আপডেট হচ্ছে..." : "Update Information"}
          </button>
        </form>
      </div>
    </div>
  );
}