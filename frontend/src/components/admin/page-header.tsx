"use client"

import * as React from "react"
import { AlunoSearch } from "@/app/alunos/aluno-search"

/**
 * PageHeader component for the admin dashboard.
 * Displays the page title, an optional subtitle, a search bar, and optional right-side actions.
 */
export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
}) {
  return (
    <div className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 lg:px-10">
        <div className="min-w-0">
          <div className="text-xl font-bold tracking-tight text-foreground uppercase flex items-center gap-3">
            <div className="w-1 h-6 bg-foreground/20 rounded-full block" />
            {title}
          </div>
          {subtitle && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40 mt-1 ml-4">
              {subtitle}
            </div>
          )}
        </div>

        <div className="w-full md:max-w-[280px]">
          <AlunoSearch />
        </div>

        {right}
      </div>
    </div>
  )
}
