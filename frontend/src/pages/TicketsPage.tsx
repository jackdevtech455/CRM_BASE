import { useState } from "react";
import { apiRequest } from "../api/request";

export default function TicketsPage() {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadTickets() {
    try {
      setError(null);

      const data = await apiRequest<unknown>("tickets");

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  }

  return (
    <main>
      <h1>Tickets</h1>

      <button type="button" onClick={loadTickets}>
        Load tickets
      </button>

      {error && <p>{error}</p>}

      {result !== null && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
