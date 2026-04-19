import React from "react";
import { Bell, Search, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-sm font-bold text-sid-black mr-8">Simulador de Descarbonização</h1>
        
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input 
            placeholder="Buscar tecnologias, roadmaps..." 
            className="pl-9 h-9 bg-slate-50 border-none text-xs focus-visible:ring-sid-green/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-sid-black">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-sid-green rounded-full ring-2 ring-white" />
        </Button>
        
        <div className="h-6 w-px bg-slate-200 mx-2" />
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 pr-2 rounded-lg transition-colors group">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:bg-sid-green/10 transition-colors">
            <User size={16} className="text-slate-600 group-hover:text-sid-green" />
          </div>
          <ChevronDown size={14} className="text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default Header;
