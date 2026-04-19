import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoginPage = router.pathname === "/login";

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Redirect to login if no session and not already on login
      if (!session && !isLoginPage) {
        router.push("/login");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !isLoginPage) {
        router.push("/login");
      }
      if (session && isLoginPage) {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [isLoginPage, router]);

  // Show nothing while checking auth (prevents flash)
  if (loading && !isLoginPage) {
    return (
      <div className={`${inter.variable} ${playfair.variable} font-sans min-h-screen bg-slate-50 flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-sid-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Carregando...</p>
        </div>
      </div>
    );
  }

  const content = <Component {...pageProps} session={session} />;

  return (
    <div className={`${inter.variable} ${playfair.variable} font-sans`}>
      {isLoginPage ? (
        content
      ) : (
        <DashboardLayout session={session}>
          {content}
        </DashboardLayout>
      )}
    </div>
  );
}
