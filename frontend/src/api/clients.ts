import type { Client, ClientCreate, ClientUpdate } from "../types/client";
import { apiFetch } from "./apiFetch";

export function getClients(): Promise<Client[]> {
  return apiFetch<Client[]>("/api/clients");
}

export function getClient(clientId: number): Promise<Client> {
  return apiFetch<Client>(`/api/clients/${clientId}`);
}

export function createClient(data: ClientCreate): Promise<Client> {
  return apiFetch<Client>("/api/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateClient(
  clientId: number,
  data: ClientUpdate,
): Promise<Client> {
  return apiFetch<Client>(`/api/clients/${clientId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteClient(clientId: number): Promise<void> {
  return apiFetch<void>(`/api/clients/${clientId}`, {
    method: "DELETE",
  });
}
