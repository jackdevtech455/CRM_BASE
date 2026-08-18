import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type SubmitEvent, useState } from "react";

import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "../api/clients";
import type { Client, ClientCreate, ClientUpdate } from "../types/client";

type ClientFormData = {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: string;
};

const emptyForm: ClientFormData = {
  name: "",
  contact_name: "",
  email: "",
  phone: "",
  status: "",
};

export default function ClientsPage() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ClientFormData>(emptyForm);

  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      setFormData(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: number;
      data: ClientUpdate;
    }) => updateClient(clientId, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      setEditingClient(null);
      setFormData(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: ClientCreate = {
      name: formData.name.trim(),
      contact_name: formData.contact_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
    };

    if (!payload.name) {
      return;
    }

    if (editingClient) {
      updateMutation.mutate({
        clientId: editingClient.id,
        data: payload,
      });

      return;
    }

    createMutation.mutate(payload);
  }

  function startEditing(client: Client) {
    setEditingClient(client);

    setFormData({
      name: client.name,
      contact_name: client.contact_name,
      email: client.email ?? "",
      phone: client.phone ?? "",
      status: client.status ?? "",
    });
  }

  function cancelEditing() {
    setEditingClient(null);
    setFormData(emptyForm);
  }

  function handleDelete(client: Client) {
    const confirmed = window.confirm(`Delete ${client.name}?`);

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(client.id);
  }

  const formMutation = editingClient ? updateMutation : createMutation;

  if (clientsQuery.isPending) {
    return (
      <main className="p-6">
        <p>Loading clients...</p>
      </main>
    );
  }

  if (clientsQuery.isError) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Clients</h1>

        <p className="mt-4 text-red-600">{clientsQuery.error.message}</p>
      </main>
    );
  }

  const clients = clientsQuery.data;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>

        <p className="mt-1 text-gray-600">
          Create and manage your CRM clients.
        </p>
      </div>

      <section className="mb-10 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {editingClient ? `Edit ${editingClient.name}` : "Add client"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Name</span>

            <input
              type="text"
              required
              value={formData.name}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Contact name</span>

            <input
              type="text"
              required
              value={formData.contact_name}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  contact_name: event.target.value,
                }))
              }
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Email</span>

            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Phone</span>

            <input
              type="tel"
              value={formData.phone}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <div className="flex gap-3 md:col-span-3">
            <button
              type="submit"
              disabled={formMutation.isPending}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {formMutation.isPending
                ? "Saving..."
                : editingClient
                  ? "Save changes"
                  : "Add client"}
            </button>

            {editingClient && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded border border-gray-300 px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>

          {formMutation.isError && (
            <p className="text-red-600 md:col-span-3">
              {formMutation.error.message}
            </p>
          )}
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">All clients</h2>

        {clients.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-600">You have not added any clients yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-4 py-3 font-medium">{client.name}</td>

                    <td className="px-4 py-3 font-medium">
                      {client.contact_name}
                    </td>

                    <td className="px-4 py-3">{client.email ?? "—"}</td>

                    <td className="px-4 py-3">{client.phone ?? "—"}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(client)}
                          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deleteMutation.isPending}
                          onClick={() => handleDelete(client)}
                          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deleteMutation.isError && (
          <p className="mt-4 text-red-600">{deleteMutation.error.message}</p>
        )}
      </section>
    </main>
  );
}
