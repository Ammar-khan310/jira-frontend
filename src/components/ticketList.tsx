import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchTickets, type Ticket } from "../redux/slices/ticketSlice";
import { Link } from "react-router-dom";
import {
  updateTicketStatus,
  deleteTicket,
  editTicket,
} from "../api/ticketService";
import { useEffect, useState } from "react";

function TicketList() {
  const dispatch = useAppDispatch();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const { tickets, loading, error } = useAppSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleStatusChange = async (ticket: Ticket, status: string) => {
    try {
      await updateTicketStatus(ticket.id, { status });
      dispatch(fetchTickets());
    } catch {
      alert("Could not update ticket status.");
    }
  };

  const handleDelete = async (ticketId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );

    if (!confirmed) return;

    try {
      await deleteTicket(ticketId);
      dispatch(fetchTickets());
    } catch {
      alert("Could not delete ticket.");
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingId(ticket.id);
    setEditTitle(ticket.title);
    setEditDescription(ticket.description);
  };

  const handleSaveEdit = async (ticketId: number) => {
    try {
      await editTicket(ticketId, {
        title: editTitle,
        description: editDescription,
      });

      setEditingId(null);
      setEditTitle("");
      setEditDescription("");

      dispatch(fetchTickets());
    } catch {
      alert("Could not update ticket.");
    }
  };

  if (loading) {
    return <p className="ticket-message">Loading tickets...</p>;
  }

  if (error) {
    return <p className="ticket-error">Error: {error}</p>;
  }

  return (
    <div className="ticket-list">
      <div className="ticket-list-heading">
        <div>
          <h2>All Tickets</h2>
          <p>View and manage your project tickets.</p>
        </div>

        <span className="ticket-count">
          {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
        </span>
      </div>

      {tickets.length === 0 ? (
        <div className="ticket-empty">
          <h3>No tickets yet</h3>
          <p>Create a ticket above to get started.</p>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <article className="ticket-card" key={ticket.id}>
              {editingId === ticket.id ? (
                <div className="ticket-edit-form">
                  <h3>Edit Ticket</h3>

                  <label htmlFor={`title-${ticket.id}`}>Title</label>
                  <input
                    id={`title-${ticket.id}`}
                    type="text"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    required
                  />

                  <label htmlFor={`description-${ticket.id}`}>
                    Description
                  </label>
                  <textarea
                    id={`description-${ticket.id}`}
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    required
                  />

                  <div className="ticket-actions">
                    <button onClick={() => handleSaveEdit(ticket.id)}>
                      Save Changes
                    </button>

                    <button
                      className="secondary-button"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="ticket-card-top">
                    <span className="ticket-id">Ticket #{ticket.id}</span>

                    <span
                      className={`status-badge status-${ticket.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <h3 className="ticket-title">{ticket.title}</h3>

                  <p className="ticket-description">
                    {ticket.description || "No description provided."}
                  </p>

                  <div className="ticket-status-control">
                    <label htmlFor={`status-${ticket.id}`}>Change status</label>

                    <select
                      id={`status-${ticket.id}`}
                      value={ticket.status}
                      onChange={(event) =>
                        handleStatusChange(ticket, event.target.value)
                      }
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </div>

                  <div className="ticket-actions">
                    <Link
                      className="ticket-details-link"
                      to={`/tickets/${ticket.id}`}
                    >
                      View Details
                    </Link>

                    <button
                      className="secondary-button"
                      onClick={() => handleEdit(ticket)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
