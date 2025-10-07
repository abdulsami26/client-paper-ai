import { GoogleLogin } from "@react-oauth/google"
import { Card, CardContent } from "@/components/ui/card"

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/50 shadow-lg">
        <CardContent className="p-8">
          <form>
            <div className="flex flex-col gap-6">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  const idToken = credentialResponse.credential;
                  console.log(idToken)
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-balance text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="#" className="underline hover:text-foreground">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
