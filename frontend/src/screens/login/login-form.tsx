import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { Card, CardContent } from "@/components/ui/card"
import { useMutation } from "react-query"
import { login, type LoginResponse } from "@/api/auth"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useCallback } from "react"
import Cookies from "js-cookie"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const { mutateAsync, isLoading } = useMutation(login, {
    onSuccess: (data: LoginResponse) => {
      const { user, token, expiresAt } = data
      const expiryDate = new Date(expiresAt)

      Cookies.set("session_token", token, { expires: expiryDate, secure: true })
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      toast.success(`Welcome, ${user.name}!`)
      navigate("/generate-paper")
    },
    onError: (error) => {
      console.error("Login failed:", error)
      toast.error("Login failed. Please try again.")
    },
  })

  const handleGoogleSuccess = useCallback(
    async (credentialResponse: CredentialResponse | null) => {
      const idToken = credentialResponse?.credential
      if (!idToken) {
        toast.error("No token received from Google.")
        return
      }
      await mutateAsync(idToken)
    },
    [mutateAsync],
  )

  const handleGoogleError = useCallback(() => {
    toast.error("Google authentication failed.")
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Signing you in...</p>
          </div>
        </div>
      )}

      <Card className="border border-border/50 shadow-2xl rounded-2xl bg-card/50 backdrop-blur-sm hover:shadow-3xl transition-shadow duration-300">
        <CardContent className="md:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              {/* <h2 className="text-xl md:text-2xl font-bold text-foreground">Sign in to your account</h2> */}
              <p className="text-sm text-muted-foreground">Use your Google account to get started</p>
            </div>

            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors duration-200 font-medium"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors duration-200 font-medium"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="relative z-10 text-center text-xs text-muted-foreground">
          <p>Trusted by students and educators worldwide</p>
        </div>
      </div>
    </div>
  )
}
