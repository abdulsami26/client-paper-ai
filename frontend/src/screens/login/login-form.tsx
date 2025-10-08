import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "react-query";
import { login } from "@/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export function LoginForm() {
  const navigate = useNavigate();

  // Mutation setup (handles async login)
  const { mutateAsync, isLoading } = useMutation(login, {
    onSuccess: () => {
      toast.success("Login successful");
      navigate("/generate-paper");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    },
  });

  // Google success callback
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

  // Google error callback
  const handleGoogleError = useCallback(() => {
    toast.error("Google authentication failed.");
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-border/50 shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />

            {isLoading && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Authenticating...
              </p>
            )}
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
