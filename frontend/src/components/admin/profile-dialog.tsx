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
  const [name, setName] = React.useState("Admin")
  const [username, setUsername] = React.useState("admin")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-border bg-card shadow-xl rounded-xl flex flex-col outline-none">
        {/* Header */}
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center px-8 pb-8 space-y-8">
          {/* Avatar with Badge */}
          <div className="relative group cursor-pointer">
            <Avatar className="size-24 border-2 border-border shadow-sm">
              <AvatarImage src="" />
              <AvatarFallback className="bg-muted text-xl font-bold text-muted-foreground">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 size-8 bg-muted text-foreground rounded-full border-2 border-card flex items-center justify-center shadow-sm hover:bg-muted/80 transition-colors">
              <CameraIcon className="size-4" />
            </div>
          </div>

          {/* Clean Inputs */}
          <div className="w-full space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="display-name" className="label-uppercase px-1">
                Nome de exibição
              </label>
              <input
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all"
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="username" className="label-uppercase px-1">
                Nome de usuário
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all"
                placeholder="@usuário"
              />
            </div>
          </div>

          {/* Info Text */}
          <p className="text-[12px] leading-relaxed text-muted-foreground text-center px-4">
            Suas informações ajudam a identificar quem realizou ações no sistema. O nome de exibição será visível em registros e atividades.
          </p>
        </div>

        {/* Footer */}
        <DialogFooter className="px-8 pb-8 flex items-center justify-end gap-3 sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="h-10 rounded-lg px-6 font-bold">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            className="h-10 rounded-lg px-8 font-bold"
            onClick={() => onOpenChange(false)}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
