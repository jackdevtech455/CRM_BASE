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

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

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

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

      setEditingClient(null);
      setFormData(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    if (editingClient) {
      const payload: ClientUpdate = {
        name: formData.name.trim(),
        contact_name: formData.contact_name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        status: formData.status.trim() || null,
      };

      updateMutation.mutate({
        clientId: editingClient.id,
        data: payload,
      });

      return;
    }

    const payload: ClientCreate = {
      name: formData.name.trim(),
      contact_name: formData.contact_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      status: formData.status.trim() || null,
    };

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
    return <p>Loading clients...</p>;
  }

  if (clientsQuery.isError) {
    return (
      <>
        <h1>Clients</h1>
        <p role="alert">{clientsQuery.error.message}</p>
      </>
    );
  }

  const clients = clientsQuery.data;

  return (
    <>
      <h1>Clients</h1>

      <section>
        <h2>{editingClient ? `Edit ${editingClient.name}` : "Add client"}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Name
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
            />
          </label>

          <label>
            Contact name
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
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </label>

          <label>
            Phone
            <input
              type="tel"
              value={formData.phone}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </label>

          <label>
            Status
            <input
              type="text"
              value={formData.status}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  status: event.target.value,
                }))
              }
            />
          </label>

          <button type="submit" disabled={formMutation.isPending}>
            {formMutation.isPending
              ? "Saving..."
              : editingClient
                ? "Save changes"
                : "Add client"}
          </button>

          {editingClient && (
            <button type="button" onClick={cancelEditing}>
              Cancel
            </button>
          )}

          {formMutation.isError && (
            <p role="alert">{formMutation.error.message}</p>
          )}
        </form>
      </section>

      <section>
        <h2>All clients</h2>

        {clients.length === 0 ? (
          <p>No clients yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.contact_name}</td>
                  <td>{client.email ?? "—"}</td>
                  <td>{client.phone ?? "—"}</td>
                  <td>{client.status ?? "—"}</td>

                  <td>
                    <button type="button" onClick={() => startEditing(client)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(client)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {deleteMutation.isError && (
          <p role="alert">{deleteMutation.error.message}</p>
        )}
      </section>
    </>
  );
}
