"use client"

import * as React from "react"
import { CameraIcon, KeyIcon, LogOutIcon, MailIcon, SaveIcon, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface ProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  // Mock data - replace with actual user data if available
  const [name, setName] = React.useState("Rafael")
  const [email, setEmail] = React.useState("rafael@escola.com")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-0 overflow-hidden flex flex-col">
        {/* Premium Header Background */}
        <div className="relative h-32 bg-linear-to-br from-primary/20 via-primary/5 to-background border-b backdrop-blur-sm">
          <div className="absolute -bottom-12 left-6 ring-4 ring-background rounded-full overflow-hidden">
            <Avatar className="size-24 border-2 border-primary/10 shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-brand font-bold">
                RA
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <CameraIcon className="size-6" />
            </button>
          </div>
        </div>

        <div className="mt-16 px-6 pb-6 flex-1 overflow-y-auto space-y-8">
          {/* Title & Greeting */}
          <div className="space-y-1">
            <h2 className="text-2xl font-brand font-bold tracking-tight">Seu Perfil</h2>
            <p className="text-sm text-muted-foreground italic">
              Bem-vindo de volta, {name}!
            </p>
          </div>

          {/* Form Sections */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <UserIcon className="size-4" />
                <span>Dados da Conta</span>
              </div>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 bg-accent/30 border-none transition-all focus:bg-accent/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    E-mail
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-accent/30 border-none transition-all focus:bg-accent/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-primary/5" />

            {/* Security */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <KeyIcon className="size-4" />
                <span>Segurança</span>
              </div>
              <Button variant="outline" className="w-full justify-start gap-2 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <KeyIcon className="size-4 text-primary" />
                Alterar senha
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-accent/10 backdrop-blur-md flex flex-col gap-3">
          <Button className="w-full h-11 font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
            <SaveIcon className="mr-2 size-4" />
            Salvar Alterações
          </Button>
          <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOutIcon className="mr-2 size-4" />
            Sair da Conta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
