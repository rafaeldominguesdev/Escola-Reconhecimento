"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ScanFaceIcon, 
  Loader2, 
  Mail, 
  Lock, 
  Check, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError("Credenciais inválidas. Verifique seu e-mail e senha.")
        setLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("Ocorreu um erro inesperado.")
      setLoading(false)
    }
  }

  return (
    <div className="dark min-h-svh bg-[#050505] flex flex-col items-center justify-center p-6 antialiased relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND AESTHETICS --- */}
      {/* Animated Mesh Gradients */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] size-[600px] bg-white/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -80, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] size-[500px] bg-white/10 blur-[100px] rounded-full"
        />
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- LOGIN CONTENT --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] z-10"
      >
        {/* Header/Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="size-16 rounded-[1.5rem] bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl mb-6 group relative"
          >
            <div className="absolute inset-0 bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            <ScanFaceIcon className="size-8 text-white/80" />
          </motion.div>
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Acessível Hub</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Painel de Controle Institucional</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative group">
          {/* Subtle Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition-opacity" />
          
          <div className="relative bg-zinc-950/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-3xl overflow-hidden">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-xs font-medium text-red-200">
                      <AlertCircle className="size-4 shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-1">Identificação</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 transition-colors group-focus-within:text-white" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11 bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 focus:ring-0 rounded-2xl text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-1">Chave de Segurança</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 transition-colors group-focus-within:text-white" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-11 pr-11 bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 focus:ring-0 rounded-2xl text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Utilities */}
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={cn(
                    "size-4 rounded-md border border-zinc-800 flex items-center justify-center transition-all",
                    rememberMe ? "bg-white border-white" : "bg-zinc-900 group-hover:border-zinc-700"
                  )}>
                    {rememberMe && <Check className="size-2.5 text-black font-bold" />}
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">Lembrar-me</span>
                </label>
                <button type="button" className="text-[11px] font-medium text-zinc-500 hover:text-white transition-colors underline-offset-4 hover:underline">
                  Esqueceu a chave?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-[11px] rounded-2xl transition-all shadow-xl shadow-white/5 flex items-center justify-center group"
                >
                  {loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Entrar no Sistema
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.5em] opacity-40 hover:opacity-100 transition-opacity cursor-default">
            Terminal Criptografado & Seguro
          </p>
        </motion.div>
      </motion.div>

      {/* Background Decorative lines */}
      <div className="absolute top-[10%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-[10%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  )
}
