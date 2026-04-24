import { createContext } from "react";

export type User = {
    id?: number;
    name: string;
    email: string;
    picture: string;
    credits?: number;
};

export type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    refreshCredits?: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { }
});
