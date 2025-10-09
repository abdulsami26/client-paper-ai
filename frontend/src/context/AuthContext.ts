import { createContext } from "react";

type User = {
    name: string;
    email: string;
    // image?: string;
};

export type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { }
});
