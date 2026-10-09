import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-emerald-600 mb-4">৪০৪</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        আপনি যে লিংকটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ঠিকানাটি ভুল।
      </p>
      <Link 
        href="/"
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}