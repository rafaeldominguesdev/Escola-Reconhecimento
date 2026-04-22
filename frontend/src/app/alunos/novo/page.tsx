"use client"

import { useMemo, useState, useEffect } from "react"
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
import { cn } from "@/lib/utils"

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

import { PageWrapper, AnimatedItem } from "@/components/page-wrapper"

export default function NovoAlunoPage() {
  const router = useRouter()

  const [nome, setNome] = useState("")
  const [turma, setTurma] = useState("")
  const [matricula, setMatricula] = useState("")

  // Estados para seleção de turma
  const [nivelSel, setNivelSel] = useState<string | null>(null)
  const [anoSel, setAnoSel] = useState<string | null>(null)
  const [salaSel, setSalaSel] = useState<string | null>(null)

  // Sincronizar turma automaticamente
  useEffect(() => {
    if (nivelSel && anoSel && salaSel) {
      const nivelLabel = TURMAS_CONFIG.find(n => n.id === nivelSel)?.label
      setTurma(`${anoSel} ${salaSel} ${nivelLabel}`)
    } else {
      setTurma("")
    }
  }, [nivelSel, anoSel, salaSel])

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
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        <AnimatedItem>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Cadastrar Novo Aluno</h1>
            <p className="text-muted-foreground text-sm">
              Preencha os dados do aluno e do responsável para o registro.
            </p>
          </div>
        </AnimatedItem>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AnimatedItem>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="size-4.5" />
                    Dados do Aluno
                  </CardTitle>
                  <CardDescription>
                    Informações básicas de identificação e turma.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6">
                  <div className="space-y-2">
                    <label className="label-uppercase px-1">Nome Completo</label>
                    <Input
                      placeholder="Nome do aluno"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <label className="label-uppercase px-1 flex items-center gap-2">
                      <School2 className="size-4" />
                      Definição da Turma
                    </label>
                    
                    <div className="space-y-6">
                      {/* Seleção de Nível */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Nível de Ensino</span>
                        <div className="flex flex-wrap gap-2 p-1 bg-muted/40 rounded-lg border border-border w-fit">
                          {TURMAS_CONFIG.map((config) => (
                            <Button
                              key={config.id}
                              type="button"
                              variant={nivelSel === config.id ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => {
                                setNivelSel(config.id)
                                setAnoSel(null)
                                setSalaSel(null)
                              }}
                              className={cn(
                                "h-9 px-5 text-xs font-bold transition-all rounded-md",
                                nivelSel === config.id ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {config.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Seleção de Ano */}
                      {nivelSel && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Ano / Série</span>
                          <div className="flex flex-wrap gap-2 p-1 bg-muted/40 rounded-lg border border-border w-fit">
                            {TURMAS_CONFIG.find(n => n.id === nivelSel)?.anos.map((ano) => (
                              <Button
                                key={ano}
                                type="button"
                                variant={anoSel === ano ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => {
                                  setAnoSel(ano)
                                  setSalaSel(null)
                                }}
                                className={cn(
                                  "h-9 px-5 text-xs font-bold transition-all rounded-md",
                                  anoSel === ano ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {ano}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Seleção de Sala */}
                      {anoSel && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">Sala</span>
                          <div className="flex flex-wrap gap-2 p-1 bg-muted/40 rounded-lg border border-border w-fit">
                            {SALAS.map((sala) => (
                              <Button
                                key={sala}
                                type="button"
                                variant={salaSel === sala ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setSalaSel(sala)}
                                className={cn(
                                  "h-9 w-11 p-0 text-xs font-bold transition-all rounded-md",
                                  salaSel === sala ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
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

                  <div className="space-y-2 pt-2">
                    <label className="label-uppercase px-1">Número da Matrícula</label>
                    <Input
                      placeholder="Identificação opcional"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </AnimatedItem>

            <AnimatedItem>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="size-4.5" />
                    Responsável
                  </CardTitle>
                  <CardDescription>
                    Dados de contato do responsável principal.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="label-uppercase px-1">Nome do Responsável</label>
                    <Input
                      placeholder="Nome completo"
                      value={nomeResp}
                      onChange={(e) => setNomeResp(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="label-uppercase px-1">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                      <Input
                        className="pl-9"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="label-uppercase px-1">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                      <Input
                        className="pl-9"
                        placeholder="email@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedItem>
          </div>

          <div className="space-y-6">
            <AnimatedItem>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="size-4.5" />
                    Fotografia
                  </CardTitle>
                  <CardDescription>
                    Identificação visual para reconhecimento facial.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border p-4 bg-muted/20">
                    <p className="truncate text-xs font-medium text-muted-foreground">{fotoNome}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="label-uppercase px-1">Carregar Arquivo</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFoto(e.target.files?.[0] || null)}
                      className="cursor-pointer file:text-[10px] file:font-bold file:uppercase file:bg-foreground file:text-background file:border-0 file:rounded file:px-2 file:py-1 file:mr-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </AnimatedItem>

            <AnimatedItem>
              <Card className="bg-muted/10">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pb-6">
                  {[
                    { label: "Aluno", value: nome },
                    { label: "Turma", value: turma },
                    { label: "Responsável", value: nomeResp }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5 px-1">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider font-mono">{item.label}</span>
                      <span className="font-semibold text-xs truncate text-foreground">{item.value || "-"}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </AnimatedItem>

            <AnimatedItem className="space-y-4">
              {erro && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-500 font-medium">
                  {erro}
                </div>
              )}

              {sucesso && (
                <div className="rounded-lg border border-foreground/10 bg-muted px-4 py-3 text-xs text-foreground font-bold animate-in zoom-in-95 duration-200 flex items-center gap-2">
                  <div className="size-1.5 bg-foreground rounded-full" />
                  {sucesso}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-11 font-bold"
                >
                  {loading ? "Salvando..." : "Confirmar Cadastro"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-11 font-bold text-muted-foreground"
                  onClick={() => router.push("/alunos")}
                >
                  Voltar
                </Button>
              </div>
            </AnimatedItem>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}