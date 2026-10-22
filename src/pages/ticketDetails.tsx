import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getTicketById } from "../api/ticketService";
import type { Ticket } from "../redux/slices/ticketSlice";

function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await getTicketById(Number(id));
        setTicket(response.ticket ?? response);
      } catch {
        setError("Could not load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    if (id && Number.isFinite(Number(id))) {
      loadTicket();
    } else {
      setError("Invalid ticket ID.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <main className="ticket-details-page">
        <p className="ticket-details-message">Loading ticket details...</p>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="ticket-details-page">
        <div className="ticket-details-card">
          <h1>Ticket unavailable</h1>
          <p className="ticket-details-error">{error || "Ticket not found."}</p>
          <Link className="ticket-details-back" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ticket-details-page">
      <div className="ticket-details-top">
        <Link className="ticket-details-back" to="/dashboard">
          ← Back to Dashboard
        </Link>
        <span className="ticket-details-id">Ticket #{ticket.id}</span>
      </div>

      <section className="ticket-details-card">
        <div className="ticket-details-heading">
          <div>
            <p className="ticket-details-eyebrow">TICKET DETAILS</p>
            <h1>{ticket.title}</h1>
          </div>

          <span
            className={`status-badge status-${ticket.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="ticket-details-divider" />

        <div className="ticket-details-section">
          <h2>Description</h2>
          <p className="ticket-details-description">
            {ticket.description || "No description provided."}
          </p>
        </div>

        <div className="ticket-details-divider" />

        <div className="ticket-details-section">
          <h2>Ticket Information</h2>

          <div className="ticket-details-info">
            <div className="ticket-info-item">
              <span>Ticket ID</span>
              <strong>#{ticket.id}</strong>
            </div>

            <div className="ticket-info-item">
              <span>Current Status</span>
              <strong>{ticket.status}</strong>
            </div>

            <div className="ticket-info-item">
              <span>Assigned To</span>
              <strong>{ticket.assignedTo?.name || "Not available"}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TicketDetails;
