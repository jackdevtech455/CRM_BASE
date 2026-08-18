import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type SubmitEvent } from "react";

import { getClients } from "../api/clients";
import {
  createTicket,
  deleteTicket,
  getTickets,
  updateTicket,
} from "../api/tickets";
import type { Ticket, TicketCreate, TicketUpdate } from "../types/ticket";

type TicketFormData = {
  title: string;
  description: string;
  status: string;
  priority: string;
  client_id: string;
};

const emptyForm: TicketFormData = {
  title: "",
  description: "",
  status: "Open",
  priority: "Medium",
  client_id: "",
};

export default function TicketsPage() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TicketFormData>(emptyForm);

  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const ticketsQuery = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const createMutation = useMutation({
    mutationFn: createTicket,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tickets"],
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
      ticketId,
      data,
    }: {
      ticketId: number;
      data: TicketUpdate;
    }) => updateTicket(ticketId, data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

      setEditingTicket(null);
      setFormData(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.title.trim() || !formData.client_id) {
      return;
    }

    if (editingTicket) {
      const payload: TicketUpdate = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status.trim() || null,
        priority: formData.priority.trim() || null,
        client_id: Number(formData.client_id),
      };

      updateMutation.mutate({
        ticketId: editingTicket.id,
        data: payload,
      });

      return;
    }

    const payload: TicketCreate = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      status: formData.status.trim() || null,
      priority: formData.priority.trim() || null,
      client_id: Number(formData.client_id),
    };

    createMutation.mutate(payload);
  }

  function startEditing(ticket: Ticket) {
    setEditingTicket(ticket);

    setFormData({
      title: ticket.title,
      description: ticket.description ?? "",
      status: ticket.status ?? "Open",
      priority: ticket.priority ?? "Medium",
      client_id: String(ticket.client_id),
    });
  }

  function cancelEditing() {
    setEditingTicket(null);
    setFormData(emptyForm);
  }

  function handleDelete(ticket: Ticket) {
    const confirmed = window.confirm(`Delete "${ticket.title}"?`);

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(ticket.id);
  }

  const formMutation = editingTicket ? updateMutation : createMutation;

  if (ticketsQuery.isPending || clientsQuery.isPending) {
    return <p>Loading tickets...</p>;
  }

  if (ticketsQuery.isError) {
    return (
      <>
        <h1>Tickets</h1>
        <p role="alert">{ticketsQuery.error.message}</p>
      </>
    );
  }

  if (clientsQuery.isError) {
    return (
      <>
        <h1>Tickets</h1>
        <p role="alert">Unable to load clients: {clientsQuery.error.message}</p>
      </>
    );
  }

  const tickets = ticketsQuery.data;
  const clients = clientsQuery.data;

  return (
    <>
      <h1>Tickets</h1>

      <section>
        <h2>{editingTicket ? `Edit ${editingTicket.title}` : "Add ticket"}</h2>

        {clients.length === 0 ? (
          <p>You need to create a client before you can create a ticket.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Title
              <input
                type="text"
                required
                value={formData.title}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Description
              <textarea
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Client
              <select
                required
                value={formData.client_id}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    client_id: event.target.value,
                  }))
                }
              >
                <option value="">Select a client</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={formData.status}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </label>

            <label>
              Priority
              <select
                value={formData.priority}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    priority: event.target.value,
                  }))
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <button type="submit" disabled={formMutation.isPending}>
              {formMutation.isPending
                ? "Saving..."
                : editingTicket
                  ? "Save changes"
                  : "Add ticket"}
            </button>

            {editingTicket && (
              <button type="button" onClick={cancelEditing}>
                Cancel
              </button>
            )}

            {formMutation.isError && (
              <p role="alert">{formMutation.error.message}</p>
            )}
          </form>
        )}
      </section>

      <section>
        <h2>All tickets</h2>

        {tickets.length === 0 ? (
          <p>No tickets yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => {
                const client = clients.find(
                  (client) => client.id === ticket.client_id,
                );

                return (
                  <tr key={ticket.id}>
                    <td>{ticket.title}</td>
                    <td>{client?.name ?? "Unknown client"}</td>
                    <td>{ticket.description ?? "—"}</td>
                    <td>{ticket.status ?? "—"}</td>
                    <td>{ticket.priority ?? "—"}</td>
                    <td>{new Date(ticket.created_at).toLocaleString()}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() => startEditing(ticket)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDelete(ticket)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
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
