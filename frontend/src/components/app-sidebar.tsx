"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CameraIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SchoolIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navMain: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/alunos", label: "Alunos", icon: UsersIcon },
  { href: "/alunos/novo", label: "Cadastrar aluno", icon: ChevronRightIcon },
  { href: "/registros", label: "Registros", icon: ClipboardListIcon },
  { href: "/entradas-saidas", label: "Entradas e saídas", icon: SchoolIcon },
  { href: "/responsaveis", label: "Responsáveis", icon: UserIcon },
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

  return (
    <Sidebar variant="inset" collapsible="icon">
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

