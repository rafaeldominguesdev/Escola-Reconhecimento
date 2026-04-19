import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Technology } from "@/types/decarbonization";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Calendar,
  Layers
} from "lucide-react";
import Logo from "@/components/Logo";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  technologies: Technology[];
  onSelect: (tech: Technology) => void;
  period?: { startYear: number; endYear: number } | null;
  isLoading?: boolean;
}

const ComparisonModal = ({ isOpen, onClose, technologies, onSelect, period, isLoading }: ComparisonModalProps) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-white border-none shadow-[0_40px_100px_rgba(0,0,0,0.3)] z-[100] p-0 rounded-[2.5rem]">
        {isLoading ? (
          <div className="p-24 flex flex-col items-center justify-center space-y-8 min-h-[500px]">
             <div className="relative group">
                <div className="absolute inset-0 bg-sid-green/30 rounded-full blur-3xl animate-pulse" />
                <motion.div 
                  animate={{ 
                    rotateY: [0, 360],
                    filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative flex items-center justify-center"
                >
                   <Logo size="lg" />
                </motion.div>
             </div>
             <div className="text-center space-y-3">
                <h3 className="text-2xl font-serif font-black tracking-tight text-sid-black">
                  <span className="text-sid-green">SID ENGINE</span> Analisando...
                </h3>
                <div className="flex flex-col items-center gap-2">
                   <p className="text-slate-400 font-medium text-sm">Cruzando dados setoriais e eficiência climática</p>
                   <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sid-green animate-bounce [animation-duration:1s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-sid-green animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-sid-green animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <>
        {/* Header Section - Medium density with Period display */}
        <DialogHeader className="px-12 pt-10 pb-6 bg-slate-50 border-b relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-1.5 h-4 bg-sid-green rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sid-green/70">Matriz de Decisão Estratégica</span>
              </div>
              <DialogTitle className="text-3xl font-serif font-black tracking-tight leading-none">
                 Quadro <span className="text-sid-green">Comparativo</span>
              </DialogTitle>
            </div>

            {period && (
              <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-sid-green/10 flex items-center justify-center text-sid-green">
                   <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Janela de Implementação</p>
                  <p className="text-xl font-black text-slate-900 font-serif">{period.startYear} — {period.endYear}</p>
                </div>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Content Section - Balanced Density */}
        <div className="flex-1 overflow-auto px-12 py-8">
          <div className="min-w-[900px] pb-4">
            <Table className="border-separate border-spacing-x-6">
              <TableHeader className="bg-white sticky top-0 z-20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[180px] border-none font-bold py-4 text-slate-300 uppercase tracking-widest text-[9px] align-bottom pb-10">
                      Métricas Técnicas
                  </TableHead>
                  {technologies.map((tech) => (
                    <TableHead key={tech.id} className="min-w-[240px] border-none text-center py-2 px-2">
                      <div className="space-y-3 p-6 rounded-[2rem] bg-sid-black text-white shadow-xl relative overflow-hidden group border-2 border-transparent hover:border-sid-green/30 transition-all">
                         <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="space-y-0.5 text-center">
                               <p className="text-[8px] font-black uppercase tracking-[0.1em] text-sid-green/60">Solução Sugerida</p>
                               <div className="text-lg font-serif font-black leading-tight tracking-tight">{tech.name}</div>
                            </div>
                            <Badge className="bg-sid-green text-sid-black font-black uppercase tracking-widest text-[8px] py-0.5 px-2.5 h-5 rounded-lg">
                               TRL {tech.implementation.trl}
                            </Badge>
                         </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Mitigation Potential */}
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell className="font-black py-8 align-middle text-slate-800 pr-4 text-[11px] border-r border-slate-50">
                     Impacto Climático
                     <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider leading-none">Mitigação Anual</p>
                  </TableCell>
                  {technologies.map((tech) => (
                    <TableCell key={tech.id} className="text-center py-8 px-4">
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                          <div className="text-2xl font-black text-sid-green">
                             {tech.mitigationPotential.toLocaleString()} 
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1.5 font-sans">tCO2e</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden mt-3 shadow-inner">
                             <div 
                                className="h-full bg-sid-green transition-all duration-700 shadow-[0_0_15px_rgba(46,204,113,0.5)]" 
                                style={{ width: `${Math.min(100, (tech.mitigationPotential / 500000) * 100)}%` }} 
                             />
                          </div>
                       </div>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Economic Efficiency */}
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell className="font-black py-8 align-middle text-slate-800 pr-4 text-[11px] border-r border-slate-50">
                     Eficiência Financeira
                     <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider leading-none">ROI e Orçamento</p>
                  </TableCell>
                  {technologies.map((tech) => {
                    const isGoodRoi = tech.economicViability.roi > 0.15;
                    return (
                      <TableCell key={tech.id} className="text-center py-8 px-4">
                        <div className="space-y-4">
                            <div className={cn(
                              "flex items-center justify-center gap-2 py-1.5 px-4 rounded-xl w-fit mx-auto border shadow-sm",
                              isGoodRoi ? "bg-sid-green/5 text-sid-green border-sid-green/30" : "bg-slate-50 text-slate-500 border-slate-200"
                            )}>
                              {isGoodRoi ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                              <span className="text-sm font-black italic tracking-tighter">ROI: {(tech.economicViability.roi * 100).toFixed(1)}%</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-left">
                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                  <span className="text-[8px] uppercase font-black text-slate-400 block tracking-widest leading-none mb-1.5">CAPEX</span>
                                  <span className="text-xs font-black text-slate-950 font-sans tracking-tight">{formatCurrency(tech.economicViability.capex)}</span>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                  <span className="text-[8px] uppercase font-black text-slate-400 block tracking-widest leading-none mb-1.5">CUSTO/T</span>
                                  <span className="text-xs font-black text-slate-950 font-sans tracking-tight">{formatCurrency(tech.economicViability.abatementCost)}</span>
                                </div>
                            </div>
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>

                {/* Tech Highlights */}
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell className="font-black py-8 align-middle text-slate-800 pr-4 text-[11px] border-r border-slate-50">
                     Análise Estratégica
                     <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider leading-none">Resumo Executivo</p>
                  </TableCell>
                  {technologies.map((tech) => (
                    <TableCell key={tech.id} className="py-4 px-4">
                       <div className="relative p-5 rounded-2xl bg-slate-50/50 border border-slate-100 italic text-slate-500 text-[11px] leading-relaxed min-h-[70px] flex items-center shadow-inner">
                          <Layers size={14} className="absolute -top-2 -left-2 text-sid-green bg-white rounded-lg p-0.5 border border-slate-100 shadow-md" />
                          "{tech.description}"
                       </div>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Selection Action */}
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell className="py-8"></TableCell>
                  {technologies.map((tech) => (
                    <TableCell key={tech.id} className="text-center py-8 px-4">
                       <Button 
                         onClick={() => onSelect(tech)} 
                         className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] group bg-sid-black hover:bg-sid-green text-white transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                       >
                         Selecionar Ativo
                         <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                       </Button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-between items-center bg-slate-50 relative px-12">
          <div className="flex items-center gap-10 text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">
             <div className="flex items-center gap-2"><ShieldCheck className="text-sid-green" size={16} /> Auditoria SID</div>
             <div className="flex items-center gap-2"><Cpu className="text-slate-800" size={16} /> IA Engine v2.0</div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-sid-black font-black uppercase tracking-widest text-[9px] h-10 rounded-xl px-8 hover:bg-white border border-transparent hover:border-slate-100 transition-all">
            Retornar ao Simulador
          </Button>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;
