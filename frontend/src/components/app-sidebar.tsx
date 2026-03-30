"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ActivityIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  LogOutIcon,
  ScanFaceIcon,
  SettingsIcon,
  UserRoundPlusIcon,
  Users2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navMain: NavItem[] = [
  { href: "/", label: "Dashboard", icon: ActivityIcon },
  { href: "/alunos", label: "Alunos", icon: GraduationCapIcon },
  { href: "/responsaveis", label: "Responsáveis", icon: Users2Icon },
  { href: "/alunos/novo", label: "Cadastrar aluno", icon: UserRoundPlusIcon },
  { href: "/registros", label: "Registros", icon: ClipboardListIcon },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = React.useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/"
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname]
  )

  const { state } = useSidebar()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 transition-all">
        {/* Layout quando Expandido */}
        <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ScanFaceIcon className="size-6" />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-brand font-bold text-lg tracking-tight text-primary">
                Escola Modelo
              </span>
            </div>
          </div>
          <SidebarTrigger />
        </div>

        {/* Layout quando modo Ícone (Colapsado) - Troca Logo por Botão no Hover */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center relative group/sidebar-logo">
          <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover/sidebar-logo:opacity-0 group-hover/sidebar-logo:scale-75">
            <ScanFaceIcon className="size-6" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/sidebar-logo:opacity-100 transition-all duration-300 transform group-hover/sidebar-logo:scale-110">
            <SidebarTrigger className="size-9 bg-accent hover:bg-accent/80" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          asChild
          data-active={isActive("/configuracoes")}
        >
          <Link href="/configuracoes">
            <SettingsIcon className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">
              Configurações
            </span>
          </Link>
        </Button>
        <SidebarSeparator />
        <Button
          variant="outline"
          className="w-full justify-start group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          asChild
        >
          <Link href="/sair">
            <LogOutIcon className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sair</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

