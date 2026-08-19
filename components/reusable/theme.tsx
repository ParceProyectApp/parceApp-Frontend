"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className="flex items-center" 
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4 mr-2" />
          <span className="text-sm">Tema oscuro</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 mr-2" />
          <span className="text-sm">Tema claro</span>
        </>
      )}
    </button>
  )
}