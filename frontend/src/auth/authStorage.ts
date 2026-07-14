const TOKEN_KEY = "access_token";

export function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}