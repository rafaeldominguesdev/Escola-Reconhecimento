"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
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
    label: "Reconhecimentos",
    color: "#2ECC71",
  },
} satisfies ChartConfig

export function ActivitiesChart({ data }: { data: ActivityPoint[] }) {
  return (
    <div className="h-[240px] w-full min-w-0">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAtividades" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="var(--border)" 
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              stroke="var(--muted-foreground)"
              fontSize={10}
              fontWeight={900}
              style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'Inter, sans-serif' }}
            />
            <YAxis 
               hide 
            />
            <ChartTooltip 
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} 
              content={<ChartTooltipContent indicator="dot" />} 
            />
            <Area
              type="monotone"
              dataKey="atividades"
              stroke="#2ECC71"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorAtividades)"
              animationDuration={1500}
              style={{
                filter: "drop-shadow(0 0 12px rgba(46, 204, 113, 0.4))",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}