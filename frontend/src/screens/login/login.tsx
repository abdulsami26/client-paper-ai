"use client"

import { FileText, Sparkles } from "lucide-react"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-primary/15 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -right-40 size-80 rounded-full bg-accent/15 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8 md:gap-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative group">
            {/* Animated glow effect */}
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl group-hover:blur-3xl transition-all duration-300" />

            {/* Logo background with gradient */}
            <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-4 shadow-2xl shadow-primary/30 group-hover:shadow-3xl group-hover:shadow-primary/40 transition-all duration-300">
              <FileText className="size-10 text-primary-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Paper AI</h1>
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <p className="text-balance text-sm md:text-base text-muted-foreground max-w-sm">
              Generate high-quality academic papers in seconds with AI-powered assistance
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full pt-2">
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/30">
              <span className="text-xs font-semibold text-primary">Fast</span>
              <span className="text-xs text-muted-foreground">Instant</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/30">
              <span className="text-xs font-semibold text-primary">Smart</span>
              <span className="text-xs text-muted-foreground">AI-Powered</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/30">
              <span className="text-xs font-semibold text-primary">Easy</span>
              <span className="text-xs text-muted-foreground">Simple</span>
            </div>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
