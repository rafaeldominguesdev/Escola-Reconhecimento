"use client"

import * as React from "react"
import { CameraIcon, SaveIcon } from "lucide-react"
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
      <DialogContent className="sm:max-w-[550px] min-h-[550px] p-0 overflow-hidden border bg-card shadow-2xl rounded-lg flex flex-col justify-between">
        <DialogHeader className="px-8 pt-10 pb-2 text-center">
          <DialogTitle className="text-2xl font-brand font-bold tracking-tight">
            Editar perfil
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center px-10 py-4 space-y-10 flex-1 justify-center">
          {/* Centralized Avatar - Scaled for square modal */}
          <div className="relative group cursor-pointer group/avatar">
            <div className="absolute -inset-1 bg-linear-to-tr from-primary/10 to-primary/5 rounded-full blur-sm opacity-50 group-hover/avatar:opacity-100 transition-opacity" />
            <Avatar className="size-40 border-[8px] border-card shadow-lg ring-1 ring-border/50 relative">
              <AvatarImage src="" />
              <AvatarFallback className="bg-muted text-4xl font-brand font-bold text-primary">
                RF
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 size-11 bg-primary text-primary-foreground rounded-full border-4 border-card flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95">
              <CameraIcon className="size-5" />
            </div>
          </div>

          {/* Harmonious Inputs - Spaced for square layout */}
          <div className="w-full space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="display-name" className="text-xs font-semibold text-muted-foreground ml-1">
                Nome de exibição
              </label>
              <div className="relative group/input">
                <input
                  id="display-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground shadow-xs"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-semibold text-muted-foreground ml-1">
                Nome de usuário
              </label>
              <div className="relative group/input">
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground shadow-xs"
                  placeholder="ex: rafael"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/20 border-t flex items-center justify-end gap-3 rounded-b-lg">
          <DialogClose asChild>
            <Button variant="ghost" className="h-11 rounded-md px-6 text-sm font-bold hover:bg-muted transition-colors">
              Cancelar
            </Button>
          </DialogClose>
          <Button className="h-11 rounded-md px-10 text-sm font-bold shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground hover:opacity-90 active:scale-95">
            <SaveIcon className="mr-2 size-4" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
