import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);
        setIsSubmitting(true);

        try {
            await login({
                email,
                password,
            });

            navigate("/", { replace: true });
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Unable to log in",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main>
            <h1>Log in</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </label>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </form>
        </main>
    );
}