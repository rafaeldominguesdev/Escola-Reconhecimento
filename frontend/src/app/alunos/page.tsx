"use client"

import { useEffect, useMemo, useState } from "react"
import { SearchIcon, Trash2, AlertTriangle } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Aluno = {
  id: number
  nome: string
  turma: string | null
  foto_path: string | null
  created_at: string | null
}

const TURMAS_CONFIG = [
  {
    id: "ef1",
    label: "Fund. 1",
    anos: ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"],
  },
  {
    id: "ef2",
    label: "Fund. 2",
    anos: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
  },
  {
    id: "em",
    label: "E. Médio",
    anos: ["1º Ano", "2º Ano", "3º Ano"],
  },
]

const SALAS = ["A", "B", "C", "D"]

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  
  // Estados para Filtros
  const [nivelAtivo, setNivelAtivo] = useState<string | null>(null)
  const [anoAtivo, setAnoAtivo] = useState<string | null>(null)
  const [salaAtiva, setSalaAtiva] = useState<string | null>(null)
  
  // Estados para Deleção
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function carregarAlunos() {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("alunos")
        .select("id, nome, turma, foto_path, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
        setError("Erro ao carregar alunos.")
        setAlunos([])
        setLoading(false)
        return
      }

      setAlunos(data || [])
      setLoading(false)
    }

    carregarAlunos()
  }, [])

  const alunosFiltrados = useMemo(() => {
    let filtrados = alunos

    // Filtro por Nível/Ano/Sala
    if (nivelAtivo || anoAtivo || salaAtiva) {
      filtrados = filtrados.filter((aluno) => {
        const turma = aluno.turma?.toLowerCase() || ""
        
        let match = true
        
        // Match simples por string
        if (nivelAtivo) {
          const nivelLabel = TURMAS_CONFIG.find(n => n.id === nivelAtivo)?.label.toLowerCase()
          if (nivelLabel && !turma.includes(nivelLabel)) match = false
        }
        
        if (anoAtivo && !turma.includes(anoAtivo.toLowerCase())) match = false
        
        if (salaAtiva && !turma.includes(` ${salaAtiva.toLowerCase()}`) && !turma.endsWith(salaAtiva.toLowerCase())) match = false
        
        return match
      })
    }

    const termo = search.trim().toLowerCase()
    if (!termo) return filtrados

    return filtrados.filter((aluno) => {
      const nome = aluno.nome?.toLowerCase() || ""
      const turma = aluno.turma?.toLowerCase() || ""
      const id = String(aluno.id)

      return (
        nome.includes(termo) ||
        turma.includes(termo) ||
        id.includes(termo)
      )
    })
  }, [alunos, search, nivelAtivo, anoAtivo, salaAtiva])

  function formatarData(data: string | null) {
    if (!data) return "-"
    return new Date(data).toLocaleString("pt-BR")
  }

  async function handleDelete() {
    if (selectedIds.length === 0) return
    
    setIsDeleting(true)
    try {
      // 1. Obter IDs dos responsáveis vinculados aos alunos que serão deletados
      const { data: vinculos } = await supabase
        .from("aluno_responsavel")
        .select("responsavel_id")
        .in("aluno_id", selectedIds)
      
      const responsavelIds = [...new Set(vinculos?.map(v => v.responsavel_id) || [])]

      // 2. Remover vínculos de responsáveis
      await supabase.from("aluno_responsavel").delete().in("aluno_id", selectedIds)
      
      // 3. Remover registros de acesso
      await supabase.from("registros").delete().in("aluno_id", selectedIds)
      
      // 4. Remover os alunos
      const { error: errorAlunos } = await supabase.from("alunos").delete().in("id", selectedIds)
      
      if (errorAlunos) throw errorAlunos

      // 5. Novo: Deletar o registro de Responsável agora (Direto, sem checar outros filhos)
      if (responsavelIds.length > 0) {
        const { error: errorResp } = await supabase.from("responsaveis").delete().in("id", responsavelIds)
        if (errorResp) {
          console.error("Erro ao deletar responsáveis:", errorResp)
          alert("O aluno foi deletado, mas não conseguimos remover o responsável do banco de dados automaticamente: " + errorResp.message + "\n\nIsso geralmente acontece por falta de permissão no Supabase (RLS).")
        }
      }
      
      // Atualizar lista local
      setAlunos(prev => prev.filter(a => !selectedIds.includes(a.id)))
      setSelectedIds([])
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error(err)
      alert("Erro ao deletar alunos. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  const selectedAlunos = useMemo(() => 
    alunos.filter(a => selectedIds.includes(a.id)),
    [alunos, selectedIds]
  )

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Alunos</h1>
        <p className="text-sm text-muted-foreground">
          Lista de alunos cadastrados no sistema.
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>Gerenciamento de alunos</CardTitle>
            <CardDescription>
              Busque por nome, turma ou ID.
            </CardDescription>
              <div className="flex flex-col gap-4">
              {/* Filtro de Nível */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-12 text-right">Nível:</span>
                <div className="inline-flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/40 shadow-inner">
                  <Button
                    variant={!nivelAtivo ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setNivelAtivo(null)
                      setAnoAtivo(null)
                      setSalaAtiva(null)
                    }}
                    className={cn(
                      "h-9 px-4 text-sm font-medium transition-all duration-200 rounded-lg",
                      !nivelAtivo ? "bg-accent/80 text-accent-foreground shadow-md shadow-white/10 ring-1 ring-border/50 hover:bg-accent" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Todos
                  </Button>
                  {TURMAS_CONFIG.map((config) => (
                    <Button
                      key={config.id}
                      variant={nivelAtivo === config.id ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setNivelAtivo(config.id)
                        setAnoAtivo(null)
                        setSalaAtiva(null)
                      }}
                      className={cn(
                        "h-9 px-4 text-sm font-medium transition-all duration-200 rounded-lg",
                        nivelAtivo === config.id ? "bg-accent/80 text-accent-foreground shadow-md shadow-white/10 ring-1 ring-border/50 hover:bg-accent" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {config.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filtro de Ano */}
              {nivelAtivo && (
                <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-12 text-right">Ano:</span>
                  <div className="inline-flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/40 shadow-inner">
                    {TURMAS_CONFIG.find(n => n.id === nivelAtivo)?.anos.map((ano) => (
                      <Button
                        key={ano}
                        variant={anoAtivo === ano ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setAnoAtivo(anoAtivo === ano ? null : ano)
                          setSalaAtiva(null)
                        }}
                        className={cn(
                          "h-9 px-4 text-sm font-medium transition-all duration-200 rounded-lg",
                          anoAtivo === ano ? "bg-accent/80 text-accent-foreground shadow-md shadow-white/10 ring-1 ring-border/50 hover:bg-accent" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {ano}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filtro de Sala */}
              {anoAtivo && (
                <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-12 text-right">Sala:</span>
                  <div className="inline-flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/40 shadow-inner">
                    {SALAS.map((sala) => (
                      <Button
                        key={sala}
                        variant={salaAtiva === sala ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setSalaAtiva(salaAtiva === sala ? null : sala)}
                        className={cn(
                          "h-9 w-10 p-0 text-sm font-medium transition-all duration-200 rounded-lg",
                          salaAtiva === sala ? "bg-accent/80 text-accent-foreground shadow-md shadow-white/10 ring-1 ring-border/50 hover:bg-accent" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {sala}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar aluno..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              {!isSelectMode ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsSelectMode(true)}
                >
                  Selecionar
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setIsSelectMode(false)
                      setSelectedIds([])
                    }}
                  >
                    Cancelar
                  </Button>
                  {selectedIds.length > 0 && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="animate-in fade-in zoom-in duration-200"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar ({selectedIds.length})
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-sm text-muted-foreground">
              Carregando alunos...
            </div>
          ) : error ? (
            <div className="py-10 text-sm text-red-500">{error}</div>
          ) : alunos.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum aluno cadastrado.
            </div>
          ) : alunosFiltrados.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum aluno encontrado para a busca.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isSelectMode && (
                      <TableHead className="w-[40px]"></TableHead>
                    )}
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Foto</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {alunosFiltrados.map((aluno) => (
                    <TableRow key={aluno.id} className={isSelectMode && selectedIds.includes(aluno.id) ? "bg-accent/40" : ""}>
                      {isSelectMode && (
                        <TableCell>
                          <input 
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                            checked={selectedIds.includes(aluno.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds(prev => [...prev, aluno.id])
                              } else {
                                setSelectedIds(prev => prev.filter(id => id !== aluno.id))
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>{aluno.id}</TableCell>
                      <TableCell className="font-medium">{aluno.nome}</TableCell>
                      <TableCell>{aluno.turma || "-"}</TableCell>
                      <TableCell>{aluno.foto_path ? "Sim" : "Não"}</TableCell>
                      <TableCell>{formatarData(aluno.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Deleção
            </DialogTitle>
            <DialogDescription>
              {selectedIds.length === 1 ? (
                <span>Tem certeza que deseja deletar permanentemente o aluno abaixo?</span>
              ) : (
                <span>Tem certeza que deseja deletar permanentemente os <strong>{selectedIds.length}</strong> alunos selecionados?</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[300px] overflow-auto rounded-lg border bg-muted/30 p-4">
            <ul className="space-y-3">
              {selectedAlunos.map(aluno => (
                <li key={aluno.id} className="flex flex-col border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <span className="font-bold text-sm">{aluno.nome}</span>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span><strong>Turma:</strong> {aluno.turma || "N/A"}</span>
                    <span><strong>ID:</strong> {aluno.id}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-destructive/10 p-3 rounded-lg flex gap-3 text-xs text-destructive">
            <Trash2 className="h-4 w-4 shrink-0" />
            <p>Esta ação não pode ser desfeita. Todos os registros de acesso e vínculos serão removidos permanentemente.</p>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deletando..." : "Sim, confirmar deleção"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}