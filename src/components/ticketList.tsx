import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchTickets, type Ticket } from "../redux/slices/ticketSlice";
import {
  updateTicketStatus,
  deleteTicket,
  editTicket,
} from "../api/ticketService";

function TicketList() {
  const dispatch = useAppDispatch();

  const { tickets, loading, error, pagination } = useAppSelector(
    (state) => state.tickets,
  );

  const selectedWorkspace = useAppSelector(
    (state) => state.workspace.selectedWorkspace,
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (!selectedWorkspace) return;

    dispatch(
      fetchTickets({
        workspaceId: selectedWorkspace.id,
        search,
        page,
        limit: 10,
      }),
    );
  }, [dispatch, selectedWorkspace, search, page]);

  const reloadTickets = () => {
    if (!selectedWorkspace) return;

    dispatch(
      fetchTickets({
        workspaceId: selectedWorkspace.id,
        search,
        page,
        limit: 10,
      }),
    );
  };

  const handleStatusChange = async (ticket: Ticket, status: string) => {
    try {
      await updateTicketStatus(ticket.id, {
        status,
        workspaceId: selectedWorkspace!.id,
      });

      reloadTickets();
    } catch {
      alert("Could not update ticket status.");
    }
  };

  const handleDelete = async (ticketId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );

    if (!confirmed || !selectedWorkspace) return;

    try {
      await deleteTicket(ticketId, selectedWorkspace.id);
      reloadTickets();
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
    if (!selectedWorkspace) return;

    try {
      await editTicket(ticketId, {
        title: editTitle,
        description: editDescription,
        workspaceId: selectedWorkspace.id,
      });

      setEditingId(null);
      setEditTitle("");
      setEditDescription("");
      reloadTickets();
    } catch {
      alert("Could not update ticket.");
    }
  };

  if (!selectedWorkspace) {
    return <p className="ticket-message">Please select a workspace.</p>;
  }

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
          <h2>Tickets</h2>
          <p>View and manage tickets in {selectedWorkspace.name}.</p>
        </div>

        <span className="ticket-count">
          {pagination.total} {pagination.total === 1 ? "Ticket" : "Tickets"}
        </span>
      </div>

      <div className="ticket-search">
        <input
          type="text"
          placeholder="Search by ticket title or ID..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      {tickets.length === 0 ? (
        <div className="ticket-empty">
          <h3>No tickets found</h3>
          <p>Try another search or create a new ticket.</p>
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

      <div className="ticket-pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage((currentPage) => currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TicketList;
