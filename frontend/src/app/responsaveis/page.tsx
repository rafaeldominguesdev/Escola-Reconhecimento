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
import { PageWrapper, AnimatedItem } from "@/components/page-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Responsavel = {
  id: number
  nome: string
  telefone: string | null
  email: string | null
  created_at: string | null
}

export default function ResponsaveisPage() {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  
  // Estados para Deleção
  const [responsavelParaDeletar, setResponsavelParaDeletar] = useState<Responsavel | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    carregarResponsaveis()
  }, [])

  async function carregarResponsaveis() {
    setLoading(true)
    setError("")

    const { data, error } = await supabase
      .from("responsaveis")
      .select("id, nome, telefone, email, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      setError("Erro ao carregar responsáveis.")
      setResponsaveis([])
      setLoading(false)
      return
    }

    setResponsaveis(data || [])
    setLoading(false)
  }

  const responsaveisFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase()

    if (!termo) return responsaveis

    return responsaveis.filter((responsavel) => {
      const nome = responsavel.nome?.toLowerCase() || ""
      const telefone = responsavel.telefone?.toLowerCase() || ""
      const email = responsavel.email?.toLowerCase() || ""
      const id = String(responsavel.id)

      return (
        nome.includes(termo) ||
        telefone.includes(termo) ||
        email.includes(termo) ||
        id.includes(termo)
      )
    })
  }, [responsaveis, search])

  async function handleDelete() {
    if (!responsavelParaDeletar) return
    
    setIsDeleting(true)
    try {
      // 1. Remover vínculos primeiro (caso ainda existam)
      await supabase.from("aluno_responsavel").delete().eq("responsavel_id", responsavelParaDeletar.id)
      
      // 2. Remover o responsável
      const { error } = await supabase.from("responsaveis").delete().eq("id", responsavelParaDeletar.id)
      
      if (error) {
        console.error(error)
        alert(`Erro ao excluir responsável: ${error.message}. Isso pode ser um problema de permissão no banco de dados.`)
        return
      }
      
      setResponsaveis(prev => prev.filter(r => r.id !== responsavelParaDeletar.id))
      setResponsavelParaDeletar(null)
    } catch (err) {
      console.error(err)
      alert("Ocorreu um erro inesperado ao tentar excluir.")
    } finally {
      setIsDeleting(false)
    }
  }

  function formatarData(data: string | null) {
    if (!data) return "-"
    return new Date(data).toLocaleString("pt-BR")
  }

  return (
    <PageWrapper>
      <div className="space-y-6 p-6">
        <AnimatedItem>
          <h1 className="text-2xl font-semibold tracking-tight">Responsáveis</h1>
          <p className="text-sm text-muted-foreground">
            Lista de responsáveis cadastrados no sistema.
          </p>
        </AnimatedItem>

        <AnimatedItem>
          <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>Gerenciamento de responsáveis</CardTitle>
            <CardDescription>
              Busque por nome, telefone, email ou ID.
            </CardDescription>
          </div>

          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar responsável..."
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="py-10 text-sm text-red-500">{error}</div>
          ) : responsaveis.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum responsável cadastrado.
            </div>
          ) : responsaveisFiltrados.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">
              Nenhum responsável encontrado para a busca.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {responsaveisFiltrados.map((responsavel) => (
                    <TableRow key={responsavel.id}>
                      <TableCell>{responsavel.id}</TableCell>
                      <TableCell className="font-medium">{responsavel.nome}</TableCell>
                      <TableCell>{responsavel.telefone || "-"}</TableCell>
                      <TableCell>{responsavel.email || "-"}</TableCell>
                      <TableCell>{formatarData(responsavel.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setResponsavelParaDeletar(responsavel)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
          </Card>
        </AnimatedItem>

      <Dialog open={!!responsavelParaDeletar} onOpenChange={(open) => !open && setResponsavelParaDeletar(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>{responsavelParaDeletar?.nome}</strong>?
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Se este responsável ainda estiver vinculado a algum aluno, os vínculos serão removidos. Esta ação não pode ser desfeita.
          </p>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setResponsavelParaDeletar(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Sim, confirmar exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </PageWrapper>
  )
}