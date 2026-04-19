import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoadmapStep } from "@/types/decarbonization";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ArrowRight, Trash2, Zap, ShieldCheck, Calendar, Save, ListChecks, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapScreenProps {
  steps: RoadmapStep[];
  onAddNextCycle: () => void;
  onRemoveStep: (id: string) => void;
  targetYear: number;
  readOnly?: boolean;
  onSave?: () => void;
}

const RoadmapScreen = ({ steps, onAddNextCycle, onRemoveStep, targetYear, readOnly = false, onSave }: RoadmapScreenProps) => {
  const [showReport, setShowReport] = useState(false);
  const lastYear = steps.length > 0 ? steps[steps.length - 1].endYear : 2026;
  const isComplete = lastYear >= targetYear;

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      localStorage.setItem("latest_roadmap", JSON.stringify(steps));
      alert("Roadmap salvo temporariamente!");
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Simulation Stats / Overview */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sid-green/10 border border-sid-green/20 text-sid-green text-[10px] font-bold uppercase tracking-widest">
             <ShieldCheck size={12} /> Roadmap Validado
          </div>
          <h1 className="text-4xl font-serif font-black tracking-tight leading-loose underline decoration-sid-green/30 decoration-8 underline-offset-8">Consolidação do Roadmap</h1>
          <p className="text-muted-foreground text-lg font-medium pt-8">
            Projeção estratégica de 2026 até <span className="text-sid-black font-black">{lastYear}</span>.
          </p>
        </div>

        <div className="flex items-center gap-6">
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Ciclos</p>
              <p className="text-2xl font-black">{steps.length}</p>
           </div>
           <div className="h-10 w-px bg-slate-200" />
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
              <p className={cn(
                "text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest",
                isComplete ? "bg-sid-green text-sid-black" : "bg-slate-100 text-slate-500"
              )}>
                {isComplete ? "Concluído" : "Em Aberto"}
              </p>
           </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="flex flex-nowrap items-start gap-10 overflow-x-auto pb-12 pt-10 px-2 scrollbar-hide min-h-[450px]">
        <AnimatePresence mode="popLayout">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-shrink-0 items-start gap-10"
            >
              <div className="w-[340px] relative group">
                {/* Year Badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sid-black text-white text-[10px] font-black px-6 py-2.5 rounded-xl z-20 shadow-2xl border border-white/10 group-hover:scale-110 transition-transform flex items-center gap-2">
                  <Calendar size={12} className="text-sid-green" /> {step.startYear} — {step.endYear}
                </div>

                <Card className="border-2 border-slate-100 hover:border-sid-green transition-all shadow-sm hover:shadow-2xl hover:-translate-y-2 duration-300 bg-white overflow-hidden group/card relative rounded-[2rem]">
                  {/* Delete Action */}
                  {!readOnly && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                      onClick={() => onRemoveStep(step.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}

                  <CardHeader className="pb-4 space-y-4 px-8 pt-10">
                    <div className="flex items-center justify-between">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-sid-green border border-slate-100">
                          <Zap size={28} className="fill-sid-green" />
                       </div>
                       <Badge className="bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-[9px] hover:bg-slate-100">
                          TRL {step.technology.implementation.trl}
                       </Badge>
                    </div>
                    <CardTitle className="text-2xl font-black h-16 flex items-center leading-tight font-serif tracking-tight">
                       {step.technology.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 px-8 pb-10">
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 h-12 border-l-2 border-slate-100 pl-4 italic font-medium">
                      "{step.technology.description}"
                    </p>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-50">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impacto Projetado</span>
                          <span className="text-sm font-black text-sid-green">
                             {step.technology.mitigationPotential.toLocaleString()} <span className="text-[9px] opacity-70">tCO2e/ano</span>
                          </span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                          <div 
                            className="h-full bg-sid-green rounded-full shadow-[0_0_15px_rgba(46,204,113,0.3)]" 
                            style={{ width: `${Math.min(100, (step.technology.mitigationPotential / 500000) * 100)}%` }} 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-50 transition-colors hover:bg-white hover:border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">CAPEX</span>
                          <span className="text-xs font-black text-slate-900 leading-none">
                             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(step.technology.economicViability.capex)}
                          </span>
                       </div>
                       <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-50 transition-colors hover:bg-white hover:border-slate-100 text-right">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">ROI</span>
                          <span className="text-xs font-black text-slate-900 leading-none italic">
                             {(step.technology.economicViability.roi * 100).toFixed(1)}%
                          </span>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 self-center">
                  <div className="w-12 h-0.5 bg-slate-100 relative origin-left">
                    <ArrowRight className="absolute -right-3 -top-2.5 text-slate-200 h-5 w-5" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Next Cycle Button - Hidden when 2050 reached */}
        {!isComplete && !readOnly && (
          <motion.div 
            layout
            className="flex-shrink-0 flex flex-col items-center justify-center w-80 h-[450px] border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:bg-slate-50/50 hover:border-sid-green/40 transition-all cursor-pointer group shadow-sm bg-white/50"
            onClick={onAddNextCycle}
          >
            <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center border border-slate-100 group-hover:bg-sid-green shadow-sm group-hover:shadow-sid-green/30 group-hover:scale-110 group-hover:border-transparent transition-all duration-300">
               <PlusCircle className="w-10 h-10 text-slate-200 group-hover:text-white transition-colors" />
            </div>
            <p className="mt-8 text-xl font-black text-slate-800 group-hover:text-sid-green transition-colors">Próximo Ciclo</p>
            <p className="mt-2 text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">SID ENGINE Platform</p>
            
            <div className="mt-10 px-6 py-2.5 rounded-full border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white group-hover:border-sid-green/20">
               Simular Opções
            </div>
          </motion.div>
        )}
      </div>

      {/* Completion Section / Timeline Summary */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="bg-sid-black rounded-[4rem] p-16 text-white shadow-3xl relative overflow-hidden border-t border-white/10">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sid-green/10 rounded-full -mr-64 -mt-64 blur-3xl p-20" />
               
               <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                  <div className="space-y-8 flex-1">
                     <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-sid-green/20 text-sid-green text-[11px] font-black uppercase tracking-[0.3em] border border-sid-green/20 shadow-lg shadow-sid-green/10">
                        <ShieldCheck size={16} /> Roadmap Estratégico 2050
                     </div>
                     <h2 className="text-5xl font-serif font-black leading-none tracking-tight">Transição Completa <br/><span className="text-sid-green italic underline decoration-sid-green/20 decoration-8">Sucedida.</span></h2>
                     <p className="text-white/50 text-xl leading-relaxed max-w-lg font-medium">
                        Sua estratégia atingiu a conformidade necessária para o Net Zero com {steps.length} ciclos validados tecnicamente.
                     </p>
                  </div>
                  
                  <div className="flex flex-col gap-5 w-full md:w-auto">
                     <Button 
                       onClick={handleSave}
                       className="h-16 bg-sid-green hover:bg-sid-green/90 text-sid-black font-black uppercase tracking-widest text-xs px-12 rounded-2xl shadow-2xl shadow-sid-green/30"
                     >
                       <Save className="mr-3 h-5 w-5" /> Salvar no Workspace
                     </Button>
                     <Button 
                       variant="ghost" 
                       onClick={() => setShowReport(!showReport)}
                       className="h-16 border border-white/20 hover:bg-white/10 text-white !text-white font-black uppercase tracking-widest text-xs px-12 rounded-2xl group"
                     >
                        <FileText className={cn("mr-3 h-5 w-5 transition-transform", showReport ? "scale-110 text-sid-green" : "group-hover:scale-110")} />
                        {showReport ? "Ocultar Relatório" : "Explorar Relatório"}
                     </Button>
                  </div>
               </div>

               {/* Summary Mini-Timeline or Report View */}
               <motion.div animate={{ height: showReport ? "auto" : "auto" }} className="mt-20 pt-12 border-t border-white/5 relative">
                  {!showReport ? (
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-10 flex items-center gap-2">
                           Visão Consolidada de Ativos <ArrowRight size={12} className="text-sid-green" />
                        </p>
                        <div className="flex items-center gap-1.5 px-4 h-12">
                           {steps.map((step, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 flex-1 min-w-0 h-full">
                                 <div 
                                    className="h-full flex-1 rounded-2xl bg-white/5 hover:bg-sid-green transition-all cursor-help border border-white/5 shadow-inner" 
                                    title={`${step.technology.name} (${step.startYear}-${step.endYear})`}
                                 />
                                 {idx < steps.length - 1 && <div className="w-1.5 h-1.5 rounded-full bg-white/10 flex-shrink-0" />}
                              </div>
                           ))}
                        </div>
                        <div className="flex justify-between mt-6 px-4">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Início SID ENGINE</span>
                           <span className="text-xs font-serif italic text-sid-green font-black">Ciclo 2050 Aprovado</span>
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Objetivo Final</span>
                        </div>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6"
                    >
                       <h3 className="text-xl font-serif font-black flex items-center gap-2">
                          <ListChecks size={20} className="text-sid-green" /> Sumário de Execução Técnica
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {steps.map((step, idx) => (
                             <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2 group hover:border-sid-green/30 transition-all">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="text-[9px] font-black text-sid-green uppercase tracking-widest">{step.startYear}-{step.endYear}</span>
                                   <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">PASSO {idx+1}</Badge>
                                </div>
                                <p className="font-serif font-black text-sm text-white leading-tight">{step.technology.name}</p>
                                <p className="text-[10px] text-white/40 font-bold">{step.technology.mitigationPotential.toLocaleString()} tCO2e mitigados</p>
                             </div>
                          ))}
                       </div>
                    </motion.div>
                  )}
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapScreen;
