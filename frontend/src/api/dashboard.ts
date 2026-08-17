import type { Dashboard } from "../types/dashboard";
import { apiRequest } from "./request";

export function getDashboard(): Promise<Dashboard> {
  return apiRequest<Dashboard>("/dashboard");
}
