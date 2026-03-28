"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Phone, User, Users, Image as ImageIcon, School2, BadgeInfo } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NovoAlunoPage() {
  const router = useRouter()

  const [nome, setNome] = useState("")
  const [turma, setTurma] = useState("")
  const [matricula, setMatricula] = useState("")

  const [nomeResp, setNomeResp] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")

  const [foto, setFoto] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  const fotoNome = useMemo(() => foto?.name || "Nenhum arquivo selecionado", [foto])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setErro("")
    setSucesso("")

    if (!nome.trim() || !turma.trim() || !nomeResp.trim()) {
      setErro("Preencha pelo menos nome do aluno, turma e nome do responsável.")
      return
    }

    setLoading(true)

    try {
      const { data: aluno, error: erroAluno } = await supabase
        .from("alunos")
        .insert([
          {
            nome: nome.trim(),
            turma: turma.trim(),
            matricula: matricula.trim() || null,
            foto_path: null,
          },
        ])
        .select()
        .single()

      if (erroAluno) {
        console.error(erroAluno)
        setErro("Erro ao criar aluno.")
        setLoading(false)
        return
      }

      const { data: responsavel, error: erroResp } = await supabase
        .from("responsaveis")
        .insert([
          {
            nome: nomeResp.trim(),
            telefone: telefone.trim() || null,
            email: email.trim() || null,
          },
        ])
        .select()
        .single()

      if (erroResp) {
        console.error(erroResp)
        setErro("Erro ao criar responsável.")
        setLoading(false)
        return
      }

      const { error: erroVinculo } = await supabase
        .from("aluno_responsavel")
        .insert([
          {
            aluno_id: aluno.id,
            responsavel_id: responsavel.id,
          },
        ])

      if (erroVinculo) {
        console.error(erroVinculo)
        setErro("Erro ao vincular responsável ao aluno.")
        setLoading(false)
        return
      }

      if (foto) {
        const fileName = `${aluno.id}-${Date.now()}-${foto.name}`

        const { error: erroFoto } = await supabase.storage
          .from("fotos-alunos")
          .upload(fileName, foto)

        if (!erroFoto) {
          await supabase
            .from("alunos")
            .update({ foto_path: fileName })
            .eq("id", aluno.id)
        }
      }

      setSucesso("Aluno cadastrado com sucesso!")

      setTimeout(() => {
        router.push("/alunos")
      }, 1200)
    } catch (error) {
      console.error(error)
      setErro("Erro inesperado ao cadastrar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Cadastrar aluno</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados do aluno, responsável e foto para criar um novo cadastro.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-4" />
                Dados do aluno
              </CardTitle>
              <CardDescription>
                Informações principais do aluno para cadastro no sistema.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Nome do aluno</label>
                <Input
                  placeholder="Digite o nome completo do aluno"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Turma</label>
                <Input
                  placeholder="Ex: 1A, 2B, 3C"
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Número da chamada / matrícula</label>
                <Input
                  placeholder="Ex: 15 ou 2026001"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4" />
                Responsável
              </CardTitle>
              <CardDescription>
                Dados do responsável principal do aluno.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Nome do responsável</label>
                <Input
                  placeholder="Digite o nome do responsável"
                  value={nomeResp}
                  onChange={(e) => setNomeResp(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="(15) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="responsavel@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="size-4" />
                Foto do aluno
              </CardTitle>
              <CardDescription>
                Você pode enviar a foto agora ou atualizar depois.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border border-dashed p-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <BadgeInfo className="size-4" />
                  Arquivo atual
                </div>
                <p className="truncate text-sm font-medium">{fotoNome}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Selecionar foto</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School2 className="size-4" />
                Resumo do cadastro
              </CardTitle>
              <CardDescription>
                Confira rapidamente os dados antes de salvar.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-muted-foreground">Aluno</span>
                <span className="font-medium">{nome || "-"}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-muted-foreground">Turma</span>
                <span className="font-medium">{turma || "-"}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-muted-foreground">Matrícula</span>
                <span className="font-medium">{matricula || "-"}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-muted-foreground">Responsável</span>
                <span className="font-medium">{nomeResp || "-"}</span>
              </div>
            </CardContent>
          </Card>

          {erro && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
              {sucesso}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando cadastro..." : "Cadastrar aluno"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/alunos")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}