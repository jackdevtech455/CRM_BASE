import { useState } from "react";
import { apiRequest } from "../api/request";

export default function DashboardPage() {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  async function testApi() {
    try {
      setError(null);

      const data = await apiRequest<unknown>("/dashboard");

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <button type="button" onClick={testApi}>
        Test dashboard API
      </button>

      {error && <p>{error}</p>}

      {result !== null && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
