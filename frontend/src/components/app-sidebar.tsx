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
  LogOutIcon,
  ScanFaceIcon,
  SettingsIcon,
  UserIcon,
  UserRoundPlusIcon,
  Users2Icon,
} from "lucide-react"

import { createClient } from "@/utils/supabase/client"

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
  useSidebar,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileDialog } from "@/components/admin/profile-dialog"
import { SettingsDialog } from "@/components/admin/settings-dialog"
import { cn } from "@/lib/utils"

import { User } from "@supabase/supabase-js"

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
  const { state } = useSidebar()
  const [user, setUser] = React.useState<User | null>(null)
  const supabase = createClient()

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

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
        <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 border-b border-border/50 mb-4">
          {/* Layout quando Expandido */}
          <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl border border-border text-primary bg-primary/5">
                <ScanFaceIcon className="size-6" />
              </div>
              <div className="flex flex-col justify-center leading-none overflow-hidden">
                <span className="label-uppercase tracking-wider">
                  Acessível Hub
                </span>
              </div>
            </div>
          </div>

          {/* Layout quando modo Ícone (Colapsado) */}
          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center relative">
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl border border-border text-primary">
              <ScanFaceIcon className="size-6" />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="label-uppercase mb-4 px-2">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {navMain.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={state !== "collapsed" && isActive(item.href)}
                        tooltip={item.label}
                        className={cn(
                          "h-9 px-3 rounded-xl border border-transparent transition-all",
                          "hover:bg-muted hover:border-border",
                          "data-[active=true]:bg-primary data-[active=true]:text-black data-[active=true]:border-primary"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className={cn(
                            "size-4 transition-colors",
                            isActive(item.href) ? "text-black" : "text-muted-foreground group-hover:text-primary"
                          )} />
                          <span className="text-xs font-semibold tracking-tight uppercase">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3 space-y-2">

          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12 px-2 rounded-xl border border-transparent hover:border-border hover:bg-muted"
                  >
                    <Avatar className="size-8 rounded-xl border border-border">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">RF</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight ml-2 group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-bold tracking-tight text-[13px]">{user?.email?.split('@')[0] || "Usuário"}</span>
                      <span className="truncate text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-tighter">{user?.email || "Administrador"}</span>
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
                      <span className="text-sm font-semibold tracking-tight text-foreground">{user?.email?.split('@')[0] || "Usuário"}</span>
                      <span className="text-xs text-muted-foreground/80 font-medium">{user?.email || "Administrador"}</span>
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
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="w-full rounded-lg px-3 py-3.5 cursor-pointer flex items-center gap-3 group transition-colors focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/5 hover:text-destructive"
                      >
                        <LogOutIcon className="size-4.5 text-muted-foreground/80 group-hover:text-destructive transition-colors" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-destructive">Encerrar Sessão</span>
                      </button>
                    </form>
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
