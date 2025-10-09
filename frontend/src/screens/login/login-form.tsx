import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "react-query";
import { login, type LoginResponse } from "@/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import Cookies from "js-cookie";

export function LoginForm() {
  const navigate = useNavigate();

  const { mutateAsync, isLoading } = useMutation(login, {
    onSuccess: (data: LoginResponse) => {
      const { user, token, expiresAt } = data;

      const expiryDate = new Date(expiresAt);

      Cookies.set("session_token", token, { expires: expiryDate, secure: true });

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.name,
          email: user.email,
          picture: user.picture,
        })
      );

      navigate("/generate-paper");
      toast.success(`Welcome, ${user.name}!`);
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    },
  });


  const handleGoogleSuccess = useCallback(
    async (credentialResponse: CredentialResponse | null) => {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        toast.error("No token received from Google.");
        return;
      }
      await mutateAsync(idToken);
    },
    [mutateAsync]
  );

  const handleGoogleError = useCallback(() => {
    toast.error("Google authentication failed.");
  }, []);

  return (
    <div className="flex flex-col gap-6 relative">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs z-50">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Card className="border border-border/50 shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
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
  );
}
