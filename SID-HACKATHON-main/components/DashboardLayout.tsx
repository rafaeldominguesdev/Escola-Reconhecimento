import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import type { Session } from "@supabase/supabase-js";
import { WifiOff, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

const DashboardLayout = ({ children, session }: DashboardLayoutProps) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Initial check
    if (!navigator.onLine) setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 flex transition-colors duration-500">
      {/* Sidebar - Fixed width */}
      <Sidebar session={session} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:pl-64 relative">
        <AnimatePresence>
          {isOffline && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500 text-white overflow-hidden z-[100]"
            >
              <div className="px-12 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg animate-pulse">
                    <WifiOff size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Conexão Perdida</p>
                    <p className="text-sm font-bold">Você está offline. O SID ENGINE não conseguirá processar novas simulações.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[9px] font-black uppercase tracking-widest">
                  Verifique sua rede
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Header />
        
        <main className="flex-1 p-12">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
