"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type ActivityPoint = {
  day: string
  atividades: number
}

const chartConfig = {
  atividades: {
    label: "Atividades",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ActivitiesChart({ data }: { data: ActivityPoint[] }) {
  return (
    <div className="h-[300px] w-full min-w-0">
      <ChartContainer config={chartConfig} className="h-full w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="atividades"
              fill="var(--color-atividades)"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}