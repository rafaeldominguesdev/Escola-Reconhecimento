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
import { 
  ChevronsUpDown, 
  HelpCircleIcon, 
  PaletteIcon, 
  UserIcon 
} from "lucide-react"

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

  const isActive = React.useCallback(
    (href: string) => {
      if (!pathname) return false
      if (href === "/") return pathname === "/"
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname]
  )

  const { state } = useSidebar()

  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 transition-all">
          {/* Layout quando Expandido */}
          <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex aspect-square size-11 items-center justify-center rounded-lg text-primary bg-primary/5">
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
            <div className="flex aspect-square size-11 items-center justify-center rounded-lg text-primary transition-all duration-300 group-hover/sidebar-logo:opacity-0 group-hover/sidebar-logo:scale-75">
              <ScanFaceIcon className="size-8" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/sidebar-logo:opacity-100 transition-all duration-300 transform group-hover/sidebar-logo:scale-110">
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
                        className="h-11 px-2 rounded-md hover:bg-accent/50 transition-all group-data-[active=true]:bg-accent"
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
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12 px-2 rounded-lg"
                  >
                    <Avatar className="size-8 rounded-lg">
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
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl shadow-2xl border-border bg-card p-2"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="" />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary">RF</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">Rafael Fernandes</span>
                        <span className="truncate text-xs text-muted-foreground">Administrador</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1.5" />
                  <DropdownMenuGroup className="space-y-1">
                    <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer transition-colors focus:bg-muted font-medium">
                      <PaletteIcon className="mr-2 size-4 text-muted-foreground" />
                      Personalização
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="rounded-lg px-3 py-2 cursor-pointer transition-colors focus:bg-muted font-medium"
                      onClick={() => setIsProfileOpen(true)}
                    >
                      <UserIcon className="mr-2 size-4 text-muted-foreground" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer transition-colors focus:bg-muted font-medium">
                      <SettingsIcon className="mr-2 size-4 text-muted-foreground" />
                      Configurações
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-1.5" />
                  <DropdownMenuGroup className="space-y-1">
                    <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer transition-colors focus:bg-muted font-medium">
                      <HelpCircleIcon className="mr-2 size-4 text-muted-foreground" />
                      Ajuda
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg px-3 py-2 cursor-pointer transition-colors focus:bg-destructive focus:text-destructive-foreground font-medium text-destructive">
                      <LogOutIcon className="mr-2 size-4" />
                      Sair da conta
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  )
}

