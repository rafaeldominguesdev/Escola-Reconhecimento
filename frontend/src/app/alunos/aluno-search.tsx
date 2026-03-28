"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"

type AlunoResultado = {
  id: number
  nome: string
  turma: string | null
}

export function AlunoSearch() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [resultados, setResultados] = useState<AlunoResultado[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function buscar() {
      if (!search.trim()) {
        setResultados([])
        return
      }

      setLoading(true)

      const { data, error } = await supabase
        .from("alunos")
        .select("id, nome, turma")
        .ilike("nome", `%${search}%`)
        .limit(5)

      if (error) {
        console.error(error)
        setResultados([])
      } else {
        setResultados(data || [])
      }

      setLoading(false)
    }

    const timeout = setTimeout(() => {
      buscar()
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  function abrirAluno(nome: string) {
    router.push(`/buscar-aluno?nome=${encodeURIComponent(nome)}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!search.trim()) return

    router.push(`/buscar-aluno?nome=${encodeURIComponent(search)}`)
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/80" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 rounded-xl border-border/70 bg-card/60 pl-9 shadow-xs"
          placeholder="Buscar aluno pelo nome..."
        />
      </form>

      {(search.trim() || loading) && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border bg-background shadow-lg">
          {loading ? (
            <div className="p-3 text-sm text-muted-foreground">
              Buscando...
            </div>
          ) : resultados.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              Nenhum aluno encontrado
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto p-1">
              {resultados.map((aluno) => (
                <button
                  key={aluno.id}
                  type="button"
                  onClick={() => abrirAluno(aluno.nome)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-muted"
                >
                  <div>
                    <div className="font-medium">{aluno.nome}</div>
                    <div className="text-xs text-muted-foreground">
                      Turma: {aluno.turma || "-"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}