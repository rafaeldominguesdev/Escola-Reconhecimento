import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ShieldCheck, Cpu, AlertCircle, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { 
            data: { full_name: fullName } 
          } 
        });
        if (error) throw error;
        setSuccess("Conta criada com sucesso! Faça login para continuar.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: any) {
      const msg = err.message || "Erro inesperado.";
      if (msg.includes("Invalid login")) {
        setError("E-mail ou senha incorretos.");
      } else if (msg.includes("already registered")) {
        setError("Este e-mail já está cadastrado.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <Head>
        <title>{`sid. | ${isLogin ? "Login" : "Cadastro"}`}</title>
      </Head>

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-sid-green/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sid-green/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="flex justify-center mb-12">
           <Logo size="lg" />
        </div>

        <Card className="shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-slate-200/50 bg-white/80 backdrop-blur-xl rounded-[3rem] overflow-hidden">
          <CardHeader className="p-12 pb-8 text-center space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sid-green/10 border border-sid-green/20 text-sid-green text-[10px] font-black uppercase tracking-widest mx-auto">
                <ShieldCheck size={12} /> Acesso Seguro
             </div>
             <CardTitle className="text-4xl font-serif font-black tracking-tight leading-none pt-2">
                {isLogin ? "Bem-vindo de Volta" : "Crie sua Conta"}
             </CardTitle>
             <CardDescription className="text-slate-400 font-medium text-base">
                {isLogin 
                  ? "Acesse o painel estratégico de descarbonização." 
                  : "Cadastre-se para simular sua transição energética."}
             </CardDescription>
          </CardHeader>

          <CardContent className="px-12 pb-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3"
              >
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-3"
              >
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-600 font-medium">{success}</p>
              </motion.div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <Input 
                      id="name"
                      placeholder="Seu nome"
                      className="h-14 pl-12 rounded-2xl border-2 border-slate-100 focus-visible:border-sid-green/30 bg-white"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    className="h-14 pl-12 rounded-2xl border-2 border-slate-100 focus-visible:border-sid-green/30 bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    className="h-14 pl-12 rounded-2xl border-2 border-slate-100 focus-visible:border-sid-green/30 bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 rounded-[1.5rem] bg-sid-black hover:bg-sid-green text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-xl hover:-translate-y-1 group"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                     <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:75ms]" />
                     <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:150ms]" />
                  </div>
                ) : (
                  <>
                    {isLogin ? "Acessar Painel" : "Criar Conta"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-12 pb-12">
            <p className="text-center text-xs font-bold text-slate-400">
               {isLogin ? "Não possui uma conta?" : "Já possui conta?"}{" "}
               <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }} 
                className="text-sid-green font-black hover:underline ml-1"
                type="button"
               >
                 {isLogin ? "Cadastre-se" : "Faça login"}
               </button>
            </p>
          </CardFooter>
        </Card>

        {/* Brand Footer */}
        <div className="mt-12 flex items-center justify-center px-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
           <div className="flex items-center gap-2">
              <Cpu size={14} /> SID ENGINE 2.0
           </div>
        </div>
      </motion.div>
    </div>
  );
}
