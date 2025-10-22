import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const { loading } = useContext(AuthContext) as unknown as { loading: boolean };

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
                    Checking session...
                </p>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/generate-paper" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
