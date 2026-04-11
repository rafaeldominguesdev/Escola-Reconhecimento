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
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-64 overflow-hidden rounded-md border-border bg-card/95 p-0 shadow-2xl backdrop-blur-xl transition-all"
                  side="top"
                  align="start"
                  sideOffset={12}
                  alignOffset={8}
                >
                  {/* Premium Header */}
                  <div className="relative overflow-hidden p-4">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                    <div className="relative flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 rounded-sm border-2 border-background shadow-md">
                          <AvatarImage src="" />
                          <AvatarFallback className="rounded-sm bg-primary/10 text-primary font-bold">RF</AvatarFallback>
                        </Avatar>
                        {/* Status Online Indicator */}
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-background bg-green-500">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-foreground">Rafael Fernandes</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">ADM</span>
                          <span className="text-[10px] text-muted-foreground/80 font-medium">rafael@escola.com</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="m-0" />

                  {/* Quick Settings Section - Theme */}
                  <div className="bg-muted/30 px-3 py-2.5">
                    <div className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Visual</div>
                    <div className="flex gap-1">
                      {[
                        { id: "light", icon: Sun, label: "Claro" },
                        { id: "dark", icon: Moon, label: "Escuro" },
                        { id: "system", icon: Monitor, label: "Auto" },
                      ].map((t) => (
                        <Button
                          key={t.id}
                          variant={mounted && theme === t.id ? "secondary" : "ghost"}
                          size="sm"
                          className={cn(
                            "h-8 flex-1 gap-1.5 px-0 text-[11px] font-bold",
                            mounted && theme === t.id ? "bg-background shadow-xs text-primary" : "text-muted-foreground hover:bg-background/50"
                          )}
                          onClick={() => setTheme(t.id)}
                          disabled={!mounted}
                        >
                          <t.icon className="size-3.5" />
                          {t.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator className="m-0" />

                  <DropdownMenuGroup className="p-1.5 space-y-0.5">
                    <DropdownMenuItem
                      className="rounded-sm px-3 py-2.5 cursor-pointer flex items-center justify-between group transition-all focus:bg-accent"
                      onClick={() => setIsProfileOpen(true)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-sm bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <UserIcon className="size-4" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight">Meu Perfil</span>
                      </div>
                      <ChevronRight className="size-3 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="rounded-sm px-3 py-2.5 cursor-pointer flex items-center justify-between group transition-all focus:bg-accent"
                      onClick={() => setIsSettingsOpen(true)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-sm bg-red-500/10 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white">
                          <SettingsIcon className="size-4" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight">Configurações</span>
                      </div>
                      <ChevronRight className="size-3 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5" />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="m-0" />

                  <div className="p-1.5">
                    <DropdownMenuItem
                      asChild
                      className="rounded-sm px-3 py-2.5 cursor-pointer flex items-center gap-2.5 group transition-all focus:bg-destructive/10 focus:text-destructive text-muted-foreground"
                    >
                      <Link href="/sair">
                        <div className="flex size-7 items-center justify-center rounded-sm bg-muted text-muted-foreground group-hover:bg-destructive group-hover:text-white transition-colors">
                          <LogOutIcon className="size-4" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight">Sair da conta</span>
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
