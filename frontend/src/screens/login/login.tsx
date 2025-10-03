import { FileText } from "lucide-react"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="gradient-bg relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-primary/20 blur-xl" />
            <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 shadow-lg shadow-primary/25">
              <FileText className="size-10 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">Paper AI</h1>
            <p className="text-balance text-sm text-muted-foreground">Sign in to continue to your account</p>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
