import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Trash2, ArrowRight, ArrowLeft, Layers, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoadmapScreen from "@/components/RoadmapScreen";
import { motion, AnimatePresence } from "framer-motion";
import { roadmapService } from "@/services/roadmapService";
import type { Session } from "@supabase/supabase-js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RoadmapsProps {
  session: Session | null;
}

export default function Roadmaps({ session }: RoadmapsProps) {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmaps = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const data = await roadmapService.getUserRoadmaps(session.user.id);
      setRoadmaps(data || []);
    } catch (err) {
      console.error("Erro ao buscar roadmaps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [session]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir esta simulação?")) return;
    try {
      await roadmapService.deleteRoadmap(id);
      setRoadmaps(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Erro ao excluir roadmap.");
    }
  };

  if (loading && !selectedRoadmap) {
    return (
      <div className="max-w-6xl mx-auto py-32 flex flex-col items-center justify-center gap-6">
         <div className="w-12 h-12 border-4 border-sid-green border-t-transparent rounded-full animate-spin" />
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Consultando Banco de Dados SID...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      <Head>
        <title>sid. | Meus Roadmaps</title>
      </Head>

      <AnimatePresence mode="wait">
        {!selectedRoadmap ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-10 gap-6">
              <div className="space-y-2">
                <h1 className="text-5xl font-serif font-black tracking-tight">Workspace de <span className="text-sid-green">Estratégias</span></h1>
                <p className="text-slate-400 text-lg font-medium">Histórico persistente de simulações tecnológicas.</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-100/50 p-2 rounded-2xl border border-slate-100">
                 <div className="px-6 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Salvo</p>
                    <p className="text-xl font-black">{roadmaps.length}</p>
                 </div>
              </div>
            </div>

            {roadmaps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100 transition-all hover:bg-slate-50">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center border border-slate-100 mb-8 shadow-xl">
                  <History className="text-slate-200" size={40} />
                </div>
                <p className="text-2xl font-serif font-black text-slate-400">Nenhuma simulação persistida.</p>
                <p className="text-xs text-slate-300 mt-3 uppercase tracking-[0.3em] font-black">As simulações concluídas aparecerão aqui</p>
                <Button
                  className="mt-10 rounded-2xl bg-sid-black text-white hover:bg-slate-800 font-black tracking-widest text-[10px] uppercase h-14 px-8"
                  onClick={() => window.location.href = "/"}
                >
                  Voltar ao Simulador
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {roadmaps.map((r) => (
                  <Card 
                    key={r.id} 
                    onClick={() => setSelectedRoadmap(r)}
                    className="rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm transition-all group hover:border-sid-green/30 bg-white cursor-pointer hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="flex flex-col md:flex-row items-center">
                       <div className="w-full md:w-16 h-12 md:h-auto bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-sid-green group-hover:text-sid-black transition-colors">
                          <Layers size={20} />
                       </div>
                       
                       <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                          <div className="space-y-1">
                             <div className="flex items-center gap-3 mb-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(r.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[9px] font-black text-sid-green uppercase tracking-widest">{r.roadmap_steps.length} Ciclos</span>
                             </div>
                             <CardTitle className="text-2xl font-serif font-black tracking-tight">{r.title}</CardTitle>
                          </div>

                          <div className="flex items-center gap-8">
                             <div className="hidden lg:flex items-center gap-4">
                                {r.roadmap_steps.slice(0, 3).map((step: any, idx: number) => (
                                   <div key={idx} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 overflow-hidden" title={step.technologies.name}>
                                      {step.technologies.name.slice(0, 2).toUpperCase()}
                                   </div>
                                ))}
                                {r.roadmap_steps.length > 3 && <div className="text-[10px] font-black text-slate-300">+{r.roadmap_steps.length - 3}</div>}
                             </div>
                             
                             <div className="flex items-center gap-3">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                  onClick={(e) => handleDelete(r.id, e)}
                                >
                                   <Trash2 size={18} />
                                </Button>
                                <div className="w-12 h-12 rounded-2xl bg-sid-black text-white flex items-center justify-center group-hover:bg-sid-green group-hover:text-sid-black transition-all">
                                   <ChevronRight size={20} />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-12"
          >
            <div className="flex items-center gap-6 mb-10">
               <Button 
                variant="ghost" 
                onClick={() => setSelectedRoadmap(null)}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-sid-green hover:text-white transition-all p-0 flex items-center justify-center group"
               >
                  <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
               </Button>
               <div>
                  <h2 className="text-3xl font-serif font-black tracking-tight">{selectedRoadmap.title}</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Análise Detalhada da Estratégia Persistida</p>
               </div>
            </div>

            <RoadmapScreen 
              steps={selectedRoadmap.roadmap_steps.map((s: any) => ({
                id: s.id,
                startYear: s.start_year,
                endYear: s.end_year,
                technology: {
                  id: s.technologies.id,
                  name: s.technologies.name,
                  description: s.technologies.description,
                  mitigationPotential: s.technologies.mitigation_potential,
                  economicViability: {
                    capex: Number(s.technologies.capex),
                    opex: Number(s.technologies.opex),
                    abatementCost: Number(s.technologies.abatement_cost),
                    roi: Number(s.technologies.roi),
                    paybackPeriod: s.technologies.payback_period,
                  },
                  implementation: {
                    trl: s.technologies.trl,
                    challenges: s.technologies.challenges,
                  },
                  marketCompetition: s.technologies.market_competition
                }
              }))} 
              onAddNextCycle={() => {}}
              onRemoveStep={() => {}}
              targetYear={selectedRoadmap.target_year}
              readOnly={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
