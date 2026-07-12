const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.detail ?? "Request failed");
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}