import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthContext, type AuthContextType } from "./AuthContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getMe } from "@/api/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  const refreshCredits = useCallback(async () => {
    try {
      const res = await getMe();
      if (res.status && res.user) {
        setUser((prev) => {
          if (!prev) return prev;
          const next = { ...prev, credits: res.user.credits };
          localStorage.setItem("user", JSON.stringify(next));
          return next;
        });
      }
    } catch {
      // ignore — network/auth errors bubble elsewhere
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = Cookies.get("session_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Sync latest credits from server
      refreshCredits();
    }

    setLoading(false);
  }, [refreshCredits]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="mt-4 text-gray-600 text-sm font-medium tracking-wide">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, refreshCredits }}>
      {children}
    </AuthContext.Provider>
  );
};
