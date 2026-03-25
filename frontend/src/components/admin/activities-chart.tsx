"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { day: "Seg", atividades: 148 },
  { day: "Ter", atividades: 162 },
  { day: "Qua", atividades: 151 },
  { day: "Qui", atividades: 177 },
  { day: "Sex", atividades: 169 },
  { day: "Sáb", atividades: 94 },
  { day: "Dom", atividades: 73 },
]

const chartConfig = {
  atividades: {
    label: "Atividades",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

export function ActivitiesChart() {
  return (
    <div className="h-[300px] w-full min-w-0">
      <ChartContainer config={chartConfig} className="h-full w-full min-w-0">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar
            dataKey="atividades"
            fill="var(--color-atividades)"
            radius={[8, 8, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

