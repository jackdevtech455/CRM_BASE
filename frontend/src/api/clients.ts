import type { Client, ClientCreate, ClientUpdate } from "../types/client";
import { apiRequest } from "./request";

export function getClients(): Promise<Client[]> {
  return apiRequest<Client[]>("/clients");
}

export function getClient(clientId: number): Promise<Client> {
  return apiRequest<Client>(`/clients/${clientId}`);
}

export function createClient(data: ClientCreate): Promise<Client> {
  return apiRequest<Client>("/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateClient(
  clientId: number,
  data: ClientUpdate,
): Promise<Client> {
  return apiRequest<Client>(`/clients/${clientId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteClient(clientId: number): Promise<void> {
  return apiRequest<void>(`/clients/${clientId}`, {
    method: "DELETE",
  });
}
