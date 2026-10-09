import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import your components
import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// Import Toastify for notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "বাজার দর | Bazar Dor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" data-theme="light">
      {/* min-h-screen and flex-col ensure the footer gets pushed to the bottom */}
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased`}>
        
        {/* Navbar shows on every page */}
        <Navbar />
        
        {/* Main page content goes here (Home, Category, Auth pages, etc.) */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer shows on every page */}
        {/* <Footer /> */}
        
        {/* Toast Container for pop-up notifications */}
        <ToastContainer position="bottom-right" theme="colored" />
        
      </body>
    </html>
  );
}