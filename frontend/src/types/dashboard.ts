import type { Client } from "./client";
// import type { Ticket } from "./ticket";

export type Dashboard = {
  client_count: number;
  ticket_count: number;
  recent_clients: Client[];
  // recent_tickets: Ticket[];
};
