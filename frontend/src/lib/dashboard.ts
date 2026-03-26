import { supabase } from "@/lib/supabase"

type ActivityPoint = {
    day: string
    atividades: number
}

type UltimoRegistro = {
    id: string
    tipo: string
    aluno: string
    hora: string
    status: string
}

export type DashboardData = {
    totalAlunos: number
    totalResponsaveis: number
    registrosHoje: number
    atividades7Dias: ActivityPoint[]
    ultimosRegistros: UltimoRegistro[]
}

function startOfDay(date: Date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

function endOfDay(date: Date) {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
}

function formatDayShort(date: Date) {
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    return dias[date.getDay()]
}

function formatHour(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

export async function getDashboardData(): Promise<DashboardData> {
    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const [
        alunosResult,
        responsaveisResult,
        registrosHojeResult,
        registros7DiasResult,
        ultimosRegistrosResult,
    ] = await Promise.all([
        supabase.from("alunos").select("*", { count: "exact", head: true }),
        supabase.from("responsaveis").select("*", { count: "exact", head: true }),
        supabase
            .from("registros")
            .select("*", { count: "exact", head: true })
            .gte("data_hora", todayStart.toISOString())
            .lte("data_hora", todayEnd.toISOString()),
        supabase
            .from("registros")
            .select("id, data_hora")
            .gte("data_hora", sevenDaysAgo.toISOString())
            .lte("data_hora", todayEnd.toISOString()),
        supabase
            .from("registros")
            .select(`
        id,
        tipo,
        data_hora,
        alunos (
          nome
        )
      `)
            .order("data_hora", { ascending: false })
            .limit(5),
    ])

    if (alunosResult.error) throw new Error("Erro ao buscar total de alunos")
    if (responsaveisResult.error) throw new Error("Erro ao buscar total de responsáveis")
    if (registrosHojeResult.error) throw new Error("Erro ao buscar registros de hoje")
    if (registros7DiasResult.error) throw new Error("Erro ao buscar atividade dos últimos 7 dias")
    if (ultimosRegistrosResult.error) throw new Error("Erro ao buscar últimos registros")

    const map = new Map<string, number>()

    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo)
        d.setDate(sevenDaysAgo.getDate() + i)
        const key = d.toISOString().slice(0, 10)
        map.set(key, 0)
    }

    for (const item of registros7DiasResult.data || []) {
        const key = new Date(item.data_hora).toISOString().slice(0, 10)
        map.set(key, (map.get(key) || 0) + 1)
    }

    const atividades7Dias: ActivityPoint[] = Array.from(map.entries()).map(
        ([dateStr, total]) => {
            const date = new Date(`${dateStr}T12:00:00`)
            return {
                day: formatDayShort(date),
                atividades: total,
            }
        }
    )

    const ultimosRegistros: UltimoRegistro[] = (ultimosRegistrosResult.data || []).map(
        (item: any) => ({
            id: String(item.id),
            tipo: item.tipo || "-",
            aluno: item.alunos?.nome || "Aluno não encontrado",
            hora: item.data_hora ? formatHour(item.data_hora) : "-",
            status: "Registrado",
        })
    )

    return {
        totalAlunos: alunosResult.count || 0,
        totalResponsaveis: responsaveisResult.count || 0,
        registrosHoje: registrosHojeResult.count || 0,
        atividades7Dias,
        ultimosRegistros,
    }
}