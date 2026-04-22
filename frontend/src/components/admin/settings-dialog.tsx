"use client"

import * as React from "react"
import { Monitor, Moon, Sun, Settings2Icon, BellIcon, ShieldIcon, PaletteIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SettingsSection = "aparencia" | "notificacoes" | "seguranca" | "sistema"

const sections: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "aparencia", label: "Aparência", icon: PaletteIcon },
  { id: "notificacoes", label: "Notificações", icon: BellIcon },
  { id: "seguranca", label: "Segurança", icon: ShieldIcon },
  { id: "sistema", label: "Sistema", icon: Settings2Icon },
]

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = React.useState<SettingsSection>("aparencia")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 overflow-hidden border-border bg-card shadow-lg rounded-xl flex flex-col gap-0">
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Configurações</DialogTitle>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar esquerda */}
          <aside className="w-64 flex-shrink-0 border-r border-border bg-muted/40 flex flex-col py-6 px-3 gap-1">
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Configurações
            </p>
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                    activeSection === section.id
                      ? "bg-background text-foreground shadow-sm font-bold border border-border"
                      : "text-muted-foreground hover:bg-background/40 hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "flex size-8 items-center justify-center rounded-md transition-colors",
                    activeSection === section.id
                      ? "bg-muted text-foreground"
                      : "bg-transparent text-muted-foreground"
                  )}>
                    <Icon className="size-4" />
                  </div>
                  {section.label}
                </button>
              )
            })}
          </aside>

          {/* Conteúdo direita */}
          <main className="flex-1 overflow-y-auto p-10 bg-background/80">
            {activeSection === "aparencia" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Aparência</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Personalize como o sistema se parece para você.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-3">Tema</p>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { id: "light", icon: Sun, label: "Claro", desc: "Interface clara e limpa" },
                        { id: "dark", icon: Moon, label: "Escuro", desc: "Reduz o cansaço visual" },
                        { id: "system", icon: Monitor, label: "Automático", desc: "Segue o sistema" },
                      ] as const).map((t) => {
                        const Icon = t.icon
                        const isActive = mounted && theme === t.id
                        return (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            disabled={!mounted}
                            className={cn(
                              "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center",
                              isActive
                                 ? "border-foreground bg-muted shadow-sm"
                                 : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                            )}
                          >
                            <div className={cn(
                              "flex size-10 items-center justify-center rounded-lg",
                              isActive ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                            )}>
                              <Icon className="size-5" />
                            </div>
                            <div>
                              <p className={cn("text-xs font-bold", isActive ? "text-foreground" : "text-muted-foreground")}>
                                {t.label}
                              </p>
                              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{t.desc}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notificacoes" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Notificações</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure como você quer receber alertas do sistema.
                  </p>
                </div>
                <ToggleRow
                  label="Entradas e saídas"
                  description="Notificar quando um aluno entrar ou sair"
                  defaultChecked
                />
                <ToggleRow
                  label="Alertas críticos"
                  description="Notificações sobre eventos urgentes"
                  defaultChecked
                />
                <ToggleRow
                  label="Relatórios diários"
                  description="Resumo automático enviado por email"
                />
              </div>
            )}

            {activeSection === "seguranca" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Segurança</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gerencie as configurações de acesso e autenticação.
                  </p>
                </div>
                <ToggleRow
                  label="Autenticação em dois fatores"
                  description="Adiciona uma camada extra de segurança"
                />
                <ToggleRow
                  label="Encerrar sessão automática"
                  description="Desconectar após 30 min de inatividade"
                  defaultChecked
                />
              </div>
            )}

            {activeSection === "sistema" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Sistema</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Informações gerais e diagnóstico do sistema.
                  </p>
                </div>
                <div className="rounded-md border border-border/40 divide-y divide-border/30">
                  {[
                    { label: "Versão", value: "1.0.0-beta" },
                    { label: "Ambiente", value: "Produção" },
                    { label: "Banco de dados", value: "Conectado" },
                    { label: "Reconhecimento facial", value: "Ativo" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground font-medium">{row.label}</span>
                      <span className="text-sm font-semibold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ToggleRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = React.useState(defaultChecked)

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  )
}
