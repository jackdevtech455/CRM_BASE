export type Ticket = {
  id: number;
  title: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  client_id: number;
  created_at: string;
};

export type TicketCreate = {
  title: string;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  client_id: number;
};

export type TicketUpdate = {
  title?: string | null;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  client_id?: number | null;
};
