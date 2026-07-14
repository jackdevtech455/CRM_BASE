const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type LoginCredentials = {
    email: string;
    password: string;
};

export type TokenResponse = {
    access_token: string;
    token_type: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    is_active?: boolean;
};

export async function login(
    credentials: LoginCredentials,
): Promise<TokenResponse> {
    const formData = new URLSearchParams();

    // OAuth2PasswordRequestForm requires "username"
    formData.set("username", credentials.email);
    formData.set("password", credentials.password);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.detail ?? `Login failed with status ${response.status}`,
        );
    }

    return response.json() as Promise<TokenResponse>;
}

export async function getCurrentUser(): Promise<User> {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("No access token available");
    }

    const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Unable to load the current user");
    }

    return response.json() as Promise<User>;
}

export type RegisterCredentials = {
    name: string;
    email: string;
    password: string;
};

export async function register(
    credentials: RegisterCredentials,
): Promise<User> {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.detail ?? `Registration failed with status ${response.status}`,
        );
    }

    return response.json() as Promise<User>;
}