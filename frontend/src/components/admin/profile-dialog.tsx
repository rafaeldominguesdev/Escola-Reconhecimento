"use client"

import * as React from "react"
import { CameraIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [name, setName] = React.useState("Rafael Fernandes")
  const [username, setUsername] = React.useState("rafaelrfd")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none bg-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[28px] flex flex-col outline-none">
        {/* Simple Header */}
        <DialogHeader className="px-6 pt-8 pb-4">
          <DialogTitle className="text-[19px] font-bold tracking-tight text-white/95">
            Editar perfil
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center px-6 pb-6 space-y-7">
          {/* Avatar with Badge */}
          <div className="relative group cursor-pointer">
            <Avatar className="size-[104px] border-none shadow-xl relative">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#2a2a2a] text-2xl font-bold text-white/90">
                RF
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 size-[30px] bg-[#212121] text-white/90 rounded-full border-[2.5px] border-[#1a1a1a] flex items-center justify-center shadow-lg hover:bg-[#2a2a2a] transition-colors">
              <CameraIcon className="size-[15px]" />
            </div>
          </div>

          {/* Minimalist Inputs */}
          <div className="w-full space-y-3">
            <div className="relative rounded-xl border border-white/[0.06] bg-[#212121] px-4 py-[11px] focus-within:ring-1 focus-within:ring-white/10 transition-shadow">
              <label htmlFor="display-name" className="block text-[11px] font-semibold text-white/40 uppercase tracking-tight">
                Nome de exibição
              </label>
              <input
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-none p-0 mt-0.5 text-[14px] font-semibold text-white/90 focus:outline-none focus:ring-0 placeholder:text-white/10"
                placeholder="Seu nome"
              />
            </div>

            <div className="relative rounded-xl border border-white/[0.06] bg-[#212121] px-4 py-[11px] focus-within:ring-1 focus-within:ring-white/10 transition-shadow">
              <label htmlFor="username" className="block text-[11px] font-semibold text-white/40 uppercase tracking-tight">
                Nome de usuário
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-none p-0 mt-0.5 text-[14px] font-semibold text-white/90 focus:outline-none focus:ring-0 placeholder:text-white/10"
                placeholder="ex: rafael"
              />
            </div>
          </div>

          {/* Info Text */}
          <p className="text-[11.5px] leading-snug text-white/40 text-center px-2">
            Seu perfil ajuda as pessoas a reconhecerem você. Seu nome e o nome de usuário também são usados no aplicativo Sora.
          </p>
        </div>

        {/* Footer with Pill Buttons */}
        <DialogFooter className="px-6 pb-8 flex-row items-center justify-end gap-2.5 bg-transparent border-none sm:justify-end">
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              className="h-8 rounded-full px-4 text-[12px] font-bold bg-[#2a2a2a] text-white/90 hover:bg-[#323232] transition-colors border-none"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            className="h-8 rounded-full px-6 text-[12px] font-bold bg-white text-black hover:bg-[#e5e5e5] active:scale-[0.97] transition-all shadow-none"
            onClick={() => onOpenChange(false)}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
