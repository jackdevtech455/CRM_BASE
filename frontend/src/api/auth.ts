import { ApiError, apiRequest } from "./client";

const API_URL = import.meta.env.VITE_API_URL;

export type User = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    access_token: string;
    token_type: string;
};

export async function login(
    credentials: LoginCredentials,
): Promise<LoginResponse> {
    const body = new URLSearchParams({
        username: credentials.email,
        password: credentials.password,
    });

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    const data: unknown = await response.json();

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        if (
            typeof data === "object" &&
            data !== null &&
            "detail" in data &&
            typeof data.detail === "string"
        ) {
            message = data.detail;
        }

        throw new ApiError(response.status, message, data);
    }

    return data as LoginResponse;
}

export function getCurrentUser() {
    return apiRequest<User>("/auth/me");
}