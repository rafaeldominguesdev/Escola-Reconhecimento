"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { AlunoSearch } from "@/app/alunos/aluno-search"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ProfileSheet } from "./profile-sheet"

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
}) {
  const [profileOpen, setProfileOpen] = React.useState(false)

  return (
    <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-backdrop-filter:backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate font-heading text-base font-medium">
            {title}
          </div>
          {subtitle ? (
            <div className="truncate text-xs text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
        </div>

        <AlunoSearch />

        {right}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Perfil">
              <Avatar className="size-8">
                <AvatarFallback>RA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/sair">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  )
}

