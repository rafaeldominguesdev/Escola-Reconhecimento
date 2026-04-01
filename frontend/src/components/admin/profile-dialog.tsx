"use client"

import * as React from "react"
import { CameraIcon, CheckIcon, XIcon } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [name, setName] = React.useState("Rafael Fernandes")
  const [username, setUsername] = React.useState("rafaelrfd")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-background/95 backdrop-blur-xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-brand font-bold tracking-tight">
            Editar perfil
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center px-6 py-4 space-y-8">
          {/* Centralized Avatar with Ring and Edit Icon */}
          <div className="relative group cursor-pointer group/avatar">
            <div className="absolute -inset-1 bg-linear-to-tr from-primary/30 to-primary/10 rounded-full blur-sm opacity-50 group-hover/avatar:opacity-100 transition-opacity" />
            <Avatar className="size-32 border-[6px] border-background shadow-xl ring-1 ring-border relative">
              <AvatarImage src="" />
              <AvatarFallback className="bg-accent/50 text-3xl font-brand font-bold text-primary">
                RF
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 size-9 bg-primary text-primary-foreground rounded-full border-4 border-background flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
              <CameraIcon className="size-4" />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
              <span className="text-xs font-semibold">Mudar foto</span>
            </div>
          </div>

          {/* Compact Harmony Inputs */}
          <div className="w-full space-y-4">
            <div className="group space-y-1.5 focus-within:translate-y-[-2px] transition-all duration-300">
              <div className="relative overflow-hidden rounded-2xl border bg-accent/20 border-border/50 group-focus-within:border-primary/40 group-focus-within:bg-accent/40 group-focus-within:shadow-sm">
                <div className="px-4 pt-3 space-y-0.5">
                  <label htmlFor="display-name" className="text-[10px] uppercase font-bold tracking-[0.1em] text-muted-foreground group-focus-within:text-primary transition-colors">
                    Nome de exibição
                  </label>
                  <input
                    id="display-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none p-0 pb-3 text-sm font-medium focus:outline-none placeholder:text-muted-foreground"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            </div>

            <div className="group space-y-1.5 focus-within:translate-y-[-2px] transition-all duration-300">
              <div className="relative overflow-hidden rounded-2xl border bg-accent/20 border-border/50 group-focus-within:border-primary/40 group-focus-within:bg-accent/40 group-focus-within:shadow-sm">
                <div className="px-4 pt-3 space-y-0.5">
                  <label htmlFor="username" className="text-[10px] uppercase font-bold tracking-[0.1em] text-muted-foreground group-focus-within:text-primary transition-colors">
                    Nome de usuário
                  </label>
                  <input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent border-none p-0 pb-3 text-sm font-medium focus:outline-none placeholder:text-muted-foreground"
                    placeholder="ex: rafael"
                  />
                </div>
              </div>
            </div>
            
            <p className="px-2 text-[11px] text-muted-foreground leading-relaxed text-center">
              Seu perfil ajuda as pessoas a reconhecerem você. Seu nome e nome de usuário também são usados no sistema Escola Modelo.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-accent/10 border-t flex items-center justify-end gap-3 rounded-b-3xl">
          <DialogClose asChild>
            <Button variant="ghost" className="h-10 rounded-xl px-6 text-sm font-semibold hover:bg-accent/20">
              Cancelar
            </Button>
          </DialogClose>
          <Button className="h-10 rounded-xl px-6 text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all bg-primary hover:bg-primary/90">
             Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
