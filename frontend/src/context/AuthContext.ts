import { createContext } from "react";

export type User = {
    name: string;
    email: string;
    picture: string;
};

export type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { }
});
