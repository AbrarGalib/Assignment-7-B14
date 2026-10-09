"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client"; // Import Better Auth client

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("সব ফিল্ড পূরণ করুন!");
      return;
    }
    
    setLoading(true);
    
    // Call the REAL Better Auth Sign In function
    await authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        toast.success("সফলভাবে সাইন ইন হয়েছে!");
        router.push("/");
        router.refresh(); // Refreshes the page state so the Navbar catches the login
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "সাইন ইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড ভুল।");
        setLoading(false);
      }
    });
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/"
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">সাইন ইন</h1>
          <p className="text-sm text-gray-500">বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              placeholder="কমপক্ষে ৮ অক্ষর" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold shadow transition disabled:bg-emerald-400"
          >
            {loading ? "লগইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs">অথবা</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => handleSocialLogin("google")}
            className="w-full border border-gray-300 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
          >
            🌐 Google দিয়ে চালিয়ে যান
          </button>
          <button 
            onClick={() => handleSocialLogin("github")}
            className="w-full border border-gray-300 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
          >
            🐙 GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই? <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">সাইন আপ করুন</Link>
        </p>
      </div>
    </div>
  );
}