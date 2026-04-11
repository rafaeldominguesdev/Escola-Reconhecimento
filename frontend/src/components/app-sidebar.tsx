"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ActivityIcon,
  ChevronRight,
  ClipboardListIcon,
  ChevronsUpDown,
  GraduationCapIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  Monitor,
  Moon,
  PaletteIcon,
  ScanFaceIcon,
  SettingsIcon,
  Sun,
  UserIcon,
  UserRoundPlusIcon,
  Users2Icon,
} from "lucide-react"

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
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileDialog } from "@/components/admin/profile-dialog"
import { SettingsDialog } from "@/components/admin/settings-dialog"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = React.useCallback(
    (href: string) => {
      if (!pathname) return false
      if (href === "/") return pathname === "/"
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname]
  )

  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 transition-all duration-500 ease-in-out">
          {/* Layout quando Expandido */}
          <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex aspect-square size-11 items-center justify-center rounded-[10px] text-primary bg-primary/5">
                <ScanFaceIcon className="size-8" />
              </div>
              <div className="flex flex-col justify-center leading-none overflow-hidden">
                <span className="font-brand font-bold text-[11px] tracking-tighter text-primary uppercase whitespace-nowrap opacity-80">
                  Escola Modelo
                </span>
              </div>
            </div>
            <SidebarTrigger />
          </div>

          {/* Layout quando modo Ícone (Colapsado) - Troca Logo por Botão no Hover */}
          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center relative group/sidebar-logo">
            <div className="flex aspect-square size-11 items-center justify-center rounded-sm text-primary transition-all duration-500 ease-in-out group-hover/sidebar-logo:opacity-0 group-hover/sidebar-logo:scale-75">
              <ScanFaceIcon className="size-8" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/sidebar-logo:opacity-100 transition-all duration-500 ease-in-out transform group-hover/sidebar-logo:scale-110">
              <SidebarTrigger className="size-11 bg-accent hover:bg-accent/80" />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-3">
            <SidebarGroupLabel className="px-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {navMain.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={item.label}
                        className="h-11 px-2 rounded-sm hover:bg-accent/50 transition-all group-data-[active=true]:bg-accent"
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className="size-5 text-muted-foreground group-data-[active=true]:text-primary transition-colors" />
                          <span className="font-medium text-sm tracking-tight">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12 px-2 rounded-sm"
                  >
                    <Avatar className="size-8 rounded-sm">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">RF</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight ml-2 group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-bold tracking-tight text-[13px]">Rafael Fernandes</span>
                      <span className="truncate text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-tighter">Administrador</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-3.5 text-muted-foreground/50 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-60 overflow-hidden rounded-xl border-border bg-card/95 p-0 shadow-2xl backdrop-blur-xl"
                  side="top"
                  align="start"
                  sideOffset={12}
                  alignOffset={8}
                >
                  {/* Minimalist Header */}
                  <div className="flex items-center gap-3 p-5 pb-4">
                    <Avatar className="h-9 w-9 rounded-full">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">RF</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold tracking-tight text-foreground">Rafael Fernandes</span>
                      <span className="text-xs text-muted-foreground/80 font-medium">Administrador</span>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="mx-0" />

                  <DropdownMenuGroup className="p-1.5 pt-2">
                    <DropdownMenuItem
                      className="rounded-lg px-3 py-3.5 cursor-pointer flex items-center justify-between group transition-colors focus:bg-accent"
                      onClick={() => setIsProfileOpen(true)}
                    >
                      <div className="flex items-center gap-3">
                        <UserIcon className="size-4.5 text-muted-foreground/80 group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium">Perfil</span>
                      </div>
                      <ChevronRight className="size-3 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="rounded-lg px-3 py-3.5 cursor-pointer flex items-center justify-between group transition-colors focus:bg-accent"
                      onClick={() => setIsSettingsOpen(true)}
                    >
                      <div className="flex items-center gap-3">
                        <SettingsIcon className="size-4.5 text-muted-foreground/80 group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium">Configurações</span>
                      </div>
                      <ChevronRight className="size-3 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5" />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="mx-0" />

                  <DropdownMenuGroup className="p-1.5">
                    <DropdownMenuItem
                      className="rounded-lg px-3 py-3.5 cursor-pointer flex items-center justify-between group transition-colors focus:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircleIcon className="size-4.5 text-muted-foreground/80 group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium">Ajuda</span>
                      </div>
                      <ChevronRight className="size-3 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5" />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="mx-0" />

                  <div className="p-1.5">
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg px-3 py-3.5 cursor-pointer flex items-center gap-3 group transition-colors focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Link href="/sair">
                        <LogOutIcon className="size-4.5 text-muted-foreground/80 group-hover:text-destructive transition-colors" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-destructive">Sair</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  )
}
