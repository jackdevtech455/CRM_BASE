import { type FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";

type LocationState = {
    from?: {
        pathname: string;
    };
};

export default function LoginPage() {
    const [email, setEmail] = useState("jack@hotmail.com");
    const [password, setPassword] = useState("hello");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as LocationState | null;
    const destination = locationState?.from?.pathname ?? "/";

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await login({
                email,
                password,
            });

            navigate(destination, { replace: true });
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unable to log in. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <p>Checking session...</p>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <main>
            <h1>Log in</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                {errorMessage && <p role="alert">{errorMessage}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </form>
        </main>
    );
}
