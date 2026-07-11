import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    getCurrentUser,
    login as loginRequest,
    type LoginCredentials,
    type User,
} from "../api/auth";

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const tokenResponse = await loginRequest(credentials);

        localStorage.setItem("access_token", tokenResponse.access_token);

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            localStorage.removeItem("access_token");
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        setUser(null);
    }, []);

    useEffect(() => {
        async function restoreSession() {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                localStorage.removeItem("access_token");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        void restoreSession();
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isLoading,
            login,
            logout,
        }),
        [user, isLoading, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}