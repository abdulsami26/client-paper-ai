import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthContext, type AuthContextType } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthContextType["user"]>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = Cookies.get("session_token");

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
