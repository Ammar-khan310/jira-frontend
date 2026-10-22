import { useState } from "react";
import { createTicket } from "../api/ticketService";
import { useAppDispatch } from "../hooks/reduxHooks";
import { fetchTickets } from "../redux/slices/ticketSlice";

function CreateTicket() {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await createTicket({
        title,
        description,
        assignedToId: Number(assignedToId),
      });

      setTitle("");
      setDescription("");
      setAssignedToId("");
      setMessage("Ticket created successfully!");

      dispatch(fetchTickets());
    } catch {
      setMessage("Ticket creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket">
      <div className="create-ticket-heading">
        <h2>Create New Ticket</h2>
        <p>Add a task and assign it to a user.</p>
      </div>

      <form className="create-ticket-form" onSubmit={handleSubmit}>
        <div className="create-ticket-field">
          <label htmlFor="title">Ticket Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter ticket title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="create-ticket-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Describe the task..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div className="create-ticket-field">
          <label htmlFor="assignedToId">Assigned User ID</label>
          <input
            id="assignedToId"
            type="number"
            min="1"
            placeholder="Enter user ID"
            value={assignedToId}
            onChange={(event) => setAssignedToId(event.target.value)}
            required
          />
          <span className="create-ticket-hint">
            Enter the ID of the user responsible for this ticket.
          </span>
        </div>

        <button
          className="create-ticket-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "+ Create Ticket"}
        </button>
      </form>

      {message && (
        <p
          className={`create-ticket-message ${
            message.includes("successfully")
              ? "message-success"
              : "message-error"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default CreateTicket;
