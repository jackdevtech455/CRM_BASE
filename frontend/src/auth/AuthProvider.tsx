import {
    createContext,
    useCallback,
    useContext,
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
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setUser(null);
            return;
        }

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            logout();
        }
    }, [logout]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const tokenResponse = await loginRequest(credentials);

        localStorage.setItem("access_token", tokenResponse.access_token);

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            localStorage.removeItem("access_token");
            setUser(null);
            throw error;
        }
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
                logout();
            } finally {
                setIsLoading(false);
            }
        }

        void restoreSession();
    }, [logout]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            isLoading,
            login,
            logout,
            refreshUser,
        }),
        [user, isLoading, login, logout, refreshUser],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
}