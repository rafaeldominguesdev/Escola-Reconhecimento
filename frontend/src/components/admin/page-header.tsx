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
    <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-backdrop-filter:backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate font-heading text-base font-medium text-foreground">
            {title}
          </div>
          {subtitle ? (
            <div className="truncate text-xs text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
        </div>

        <AlunoSearch />

        {right}
      </div>
    </div>
  )
}
