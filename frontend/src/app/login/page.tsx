"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanFaceIcon, Loader2, AlertCircle, ArrowRight, Eye, EyeOff, GraduationCapIcon } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
        setError(authError.message === "Invalid login credentials" ? "Credenciais inválidas. Verifique seu e-mail e senha." : authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Verificar se o usuário existe na tabela 'perfis'
        const { data: profile, error: profileError } = await supabase
          .from("perfis")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError || !profile) {
          // Tentar criar o perfil caso o trigger tenha falhado ou seja um usuário antigo
          const { error: createError } = await supabase
            .from("perfis")
            .insert([
              { 
                id: data.user.id, 
                email: data.user.email, 
                nome: "Administrador", 
                role: "admin" 
              }
            ])

          if (createError) {
            console.error("Erro ao criar perfil:", createError)
            await supabase.auth.signOut()
            setError("Acesso negado: Perfil não encontrado e não pôde ser criado automaticamente.")
            setLoading(false)
            return
          }
        }
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("Ocorreu um erro inesperado ao realizar o login.")
      setLoading(false)
    }
  }

  return (
    <div className="dark min-h-svh bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[150px] rounded-full animate-mesh" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-mesh [animation-delay:4s]" />
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full animate-mesh [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center justify-center size-20 rounded-[2rem] bg-black border border-white/10 shadow-2xl relative group"
          >
            <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:bg-primary/40 transition-all rounded-full" />
            <ScanFaceIcon className="size-10 text-primary relative z-10" />
          </motion.div>
          
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-serif font-black tracking-tight text-white uppercase"
            >
              Acessível Hub
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-[0.4em]"
            >
              Gestão Escolar de Elite
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Card className="sid-glass sid-glow-border rounded-[2.5rem] border-white/5 shadow-3xl overflow-hidden">
            <CardHeader className="pt-10 pb-6 text-center">
              <CardTitle className="text-xl font-serif font-black text-white">Autenticação</CardTitle>
              <CardDescription className="text-[9px] text-muted-foreground/60 uppercase tracking-[0.3em] font-black">
                Terminal Administrativo Seguro
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-6 px-8">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-[10px] font-black text-red-200 uppercase tracking-widest"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="label-uppercase px-2">E-mail Corporativo</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@exemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-14 rounded-2xl px-5 text-white placeholder:text-muted-foreground/20 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" title="Password" className="label-uppercase px-2">Chave de Acesso</Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-14 rounded-2xl px-5 pr-12 text-white placeholder:text-muted-foreground/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-8 pt-6 pb-10 flex flex-col gap-6">
                <Button 
                    type="submit" 
                    className="w-full rounded-2xl h-14 bg-primary text-black font-black uppercase tracking-[0.2em] text-[12px] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3" 
                    disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      Acessar Sistema <ArrowRight className="size-5" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center"
        >
            <p className="text-[9px] text-muted-foreground/20 font-black uppercase tracking-[0.5em]">
                Criptografia de Ponta a Ponta
            </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
