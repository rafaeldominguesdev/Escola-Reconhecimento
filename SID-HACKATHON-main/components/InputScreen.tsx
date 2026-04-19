import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserInputs } from "@/types/decarbonization";
import { CalendarIcon, Info, TrendingUp, DollarSign, Target, Flag } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface InputScreenProps {
  onGenerate: (inputs: UserInputs) => void;
}

const InputScreen = ({ onGenerate }: InputScreenProps) => {
  const [netZero, setNetZero] = useState<string>("true");
  const [percent, setPercent] = useState<number>(50);
  const [capex, setCapex] = useState<string>("50000000");
  const [opex, setOpex] = useState<string>("5000000");
  const [maxAbatement, setMaxAbatement] = useState<number>(200);
  const [targetYear, setTargetYear] = useState<string>("2050");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(2026, 0, 1),
    to: new Date(2030, 11, 31),
  });

  // Sync targetYear with netZero selection
  useEffect(() => {
    if (netZero === "true") {
      setTargetYear("2050");
    }
  }, [netZero]);

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, "");
    if (!num) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(Number(num));
  };

  const handleCurrencyChange = (value: string, setter: (v: string) => void) => {
    setter(value.replace(/\D/g, ""));
  };

  const handleGenerate = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    onGenerate({
      netZeroTarget: netZero === "true",
      emissionReductionPercentage: netZero === "false" ? percent : undefined,
      capexBudget: Number(capex),
      opexBudget: Number(opex),
      maxAbatementCost: maxAbatement,
      minTrl: 1,
      maxTrl: 9,
      initialRoadmapPeriod: {
        startYear: dateRange.from.getFullYear(),
        endYear: dateRange.to.getFullYear(),
      },
      targetYear: Number(targetYear)
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <Card className="shadow-2xl border-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 pb-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-xl bg-sid-green/10 flex items-center justify-center">
                <Target className="text-sid-green w-4 h-4" />
             </div>
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-sid-green/70">SID ENGINE</span>
          </div>
          <CardTitle className="text-4xl font-serif font-black tracking-tight leading-tight">
            Parâmetros de <span className="text-sid-green italic">Simulação</span>
          </CardTitle>
          <CardDescription className="text-sm text-slate-400 font-medium max-w-xl mt-2 leading-relaxed">
            Configure o horizonte temporal e limites financeiros da sua estratégia.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 p-10 pt-10">
          {/* Target Section */}
          <div className="space-y-6">
            <div className="space-y-2">
               <Label className="text-base font-black text-slate-900 font-serif tracking-tight">Objetivo de Sustentabilidade</Label>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Compromisso institucional.</p>
            </div>
            
            <RadioGroup value={netZero} onValueChange={setNetZero} className="grid grid-cols-1 gap-3">
              <div className={cn(
                "flex items-center space-x-3 border rounded-[1.25rem] p-4 hover:bg-slate-50 transition-all cursor-pointer group",
                netZero === "true" ? "border-sid-green bg-sid-green/5" : "border-slate-100"
              )}>
                <RadioGroupItem value="true" id="netzero" className="w-4 h-4 border-2" />
                <Label htmlFor="netzero" className="flex-1 cursor-pointer">
                  <span className="block text-sm font-black text-slate-900 leading-none">Net Zero em 2050</span>
                </Label>
              </div>
              <div className={cn(
                "flex items-center space-x-3 border rounded-[1.25rem] p-4 hover:bg-slate-50 transition-all cursor-pointer group",
                netZero === "false" ? "border-sid-green bg-sid-green/5" : "border-slate-100"
              )}>
                <RadioGroupItem value="false" id="percent" className="w-4 h-4 border-2" />
                <Label htmlFor="percent" className="flex-1 cursor-pointer">
                  <span className="block text-sm font-black text-slate-900 leading-none">Meta Percentual Customizada</span>
                </Label>
              </div>
            </RadioGroup>

            {netZero === "false" && (
              <div className="pl-6 border-l-4 border-sid-green/20 space-y-4 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Volume de Redução (%)</Label>
                   <div className="relative max-w-[120px]">
                     <Input 
                       type="number" 
                       min={0} max={100}
                       value={percent}
                       onChange={(e) => setPercent(Number(e.target.value))}
                       className="h-10 text-xl font-black text-center border-2 border-slate-100 focus-visible:border-sid-green rounded-xl"
                     />
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-sid-green/30 text-lg">%</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                     <Flag size={10} className="text-sid-green" /> Horizonte Final (Ano Alvo)
                   </Label>
                   <Select value={targetYear} onValueChange={(val) => setTargetYear(val || "2050")}>
                     <SelectTrigger className="w-[140px] h-10 border-2 border-slate-100 font-black rounded-xl text-xs">
                       <SelectValue placeholder="Ano Alvo" />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl border-slate-100">
                        <SelectItem value="2030" className="text-xs font-bold">2030</SelectItem>
                        <SelectItem value="2035" className="text-xs font-bold">2035</SelectItem>
                        <SelectItem value="2040" className="text-xs font-bold">2040</SelectItem>
                        <SelectItem value="2045" className="text-xs font-bold">2045</SelectItem>
                        <SelectItem value="2050" className="text-xs font-bold">2050</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
              </div>
            )}
          </div>

          {/* Period Section */}
          <div className="space-y-6">
            <div className="space-y-2">
               <Label className="text-base font-black text-slate-900 font-serif tracking-tight">Ciclo de Início</Label>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Prazos de implementação inicial.</p>
            </div>
            
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-black h-14 text-xl border-slate-100 hover:border-sid-green/40 hover:bg-slate-50 rounded-xl shadow-sm bg-white px-5"
                      nativeButton={true}
                    />
                  }
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-sid-green" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span className="tracking-tighter text-slate-800 font-serif">
                        {dateRange.from.getFullYear()} — {dateRange.to.getFullYear()}
                      </span>
                    ) : (
                      dateRange.from.getFullYear()
                    )
                  ) : (
                    <span className="text-muted-foreground">Período Inicial</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-[2rem] overflow-hidden" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={{
                      from: dateRange?.from as Date,
                      to: dateRange?.to as Date,
                    }}
                    onSelect={(range) => setDateRange(range as any)}
                    numberOfMonths={2}
                    locale={ptBR}
                    captionLayout="dropdown"
                    fromYear={2024}
                    toYear={Number(targetYear)}
                    className="p-4"
                  />
                </PopoverContent>
              </Popover>
              <div className="bg-slate-50/80 p-4 rounded-xl flex gap-3 items-start border border-slate-100/50">
                 <Info size={16} className="text-sid-green flex-shrink-0 mt-0.5" />
                 <p className="text-[9px] text-slate-500 leading-normal font-bold uppercase tracking-[0.15em]">
                   Ao atingir o ano alvo ({targetYear}), o simulador apresentará o relatório final consolidado.
                 </p>
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="md:col-span-2 pt-8 border-t border-slate-50 space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sid-black flex items-center justify-center text-white shadow-lg">
                   <DollarSign size={16} />
                </div>
                <Label className="text-xl font-black font-serif tracking-tight pr-2">Capacidade Financeira Anual</Label>
                <div className="h-px flex-1 bg-slate-50" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                      Budget CAPEX Máximo
                   </Label>
                   <Input
                     value={formatCurrency(capex)}
                     onChange={(e) => handleCurrencyChange(e.target.value, setCapex)}
                     className="h-12 text-xl font-black bg-slate-50/30 border-2 border-transparent focus-visible:bg-white focus-visible:border-sid-green/30 transition-all rounded-xl px-4"
                   />
                </div>

                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                      Custos de OPEX
                   </Label>
                   <Input
                     value={formatCurrency(opex)}
                     onChange={(e) => handleCurrencyChange(e.target.value, setOpex)}
                     className="h-12 text-xl font-black bg-slate-50/30 border-2 border-transparent focus-visible:bg-white focus-visible:border-sid-green/40 transition-all rounded-xl px-4"
                   />
                </div>

                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                     Limite tCO2e
                   </Label>
                   <div className="relative">
                      <Input
                        type="number"
                        value={maxAbatement}
                        onChange={(e) => setMaxAbatement(Number(e.target.value))}
                        className="h-12 text-xl font-black bg-slate-50/30 border-2 border-transparent focus-visible:bg-white focus-visible:border-sid-green/40 transition-all rounded-xl px-4"
                      />
                      <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 text-sid-green/20" size={20} />
                   </div>
                </div>
             </div>
          </div>
        </CardContent>

        <CardFooter className="p-8 flex justify-center border-t border-slate-50 bg-slate-50/20">
          <Button 
            onClick={handleGenerate}
            disabled={!capex || !opex}
            size="lg"
            className="px-12 h-16 text-base font-black uppercase tracking-[0.2em] bg-sid-black hover:bg-sid-green text-white rounded-[1.25rem] transition-all shadow-xl hover:-translate-y-1 group"
          >
            Iniciar Simulação de Roadmap
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InputScreen;
