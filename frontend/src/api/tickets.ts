import type { Ticket, TicketCreate, TicketUpdate } from "../types/ticket";
import { apiRequest } from "./request";

export function getTickets(): Promise<Ticket[]> {
  return apiRequest<Ticket[]>("/tickets");
}

export function getTicket(ticketId: number): Promise<Ticket> {
  return apiRequest<Ticket>(`/tickets/${ticketId}`);
}

export function createTicket(data: TicketCreate): Promise<Ticket> {
  return apiRequest<Ticket>("/tickets", {
    method: "POST",
    body: data,
  });
}

export function updateTicket(
  ticketId: number,
  data: TicketUpdate,
): Promise<Ticket> {
  return apiRequest<Ticket>(`/tickets/${ticketId}`, {
    method: "PATCH",
    body: data,
  });
}

export function deleteTicket(ticketId: number): Promise<void> {
  return apiRequest<void>(`/tickets/${ticketId}`, {
    method: "DELETE",
  });
}
