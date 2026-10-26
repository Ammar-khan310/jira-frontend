import { useEffect, useState } from "react";
import { createTicket } from "../api/ticketService";
import api from "../api/axios";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchTickets } from "../redux/slices/ticketSlice";

interface WorkspaceMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

function CreateTicket() {
  const dispatch = useAppDispatch();

  const selectedWorkspace = useAppSelector(
    (state) => state.workspace.selectedWorkspace,
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedWorkspace) {
        setMembers([]);
        setAssignedToId("");
        return;
      }

      try {
        setSearchLoading(true);

        const response = await api.get(
          `/workspaces/${selectedWorkspace.id}/members`,
          { params: { search } },
        );

        setMembers(response.data.members);
      } catch (error) {
        console.error("Failed to search workspace members:", error);
        setMembers([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedWorkspace?.id, search]);

  useEffect(() => {
    setAssignedToId("");
  }, [selectedWorkspace?.id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!selectedWorkspace) {
      setMessage("Please select a workspace first.");
      return;
    }

    if (!assignedToId) {
      setMessage("Please select a workspace member.");
      return;
    }

    setLoading(true);

    try {
      await createTicket({
        title,
        description,
        assignedToId: Number(assignedToId),
        workspaceId: selectedWorkspace.id,
      });

      setTitle("");
      setDescription("");
      setAssignedToId("");
      setSearch("");
      setMessage("Ticket created successfully!");

      dispatch(fetchTickets({ workspaceId: selectedWorkspace.id }));
    } catch (error) {
      console.error("Ticket creation failed:", error);
      setMessage("Ticket creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket">
      <div className="create-ticket-heading">
        <h2>Create New Ticket</h2>
        <p>Workspace: {selectedWorkspace?.name || "No workspace selected"}</p>
      </div>

      {!selectedWorkspace ? (
        <p>Please create or join a workspace first.</p>
      ) : (
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
            <label htmlFor="memberSearch">Search workspace members</label>
            <input
              id="memberSearch"
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setAssignedToId("");
              }}
            />

            <label htmlFor="assignedToId">Assign ticket to</label>
            <select
              id="assignedToId"
              value={assignedToId}
              onChange={(event) => setAssignedToId(event.target.value)}
              required
            >
              <option value="">
                {searchLoading ? "Searching members..." : "Select a member"}
              </option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>

            {!searchLoading && members.length === 0 && (
              <span className="create-ticket-hint">
                No workspace members found.
              </span>
            )}
          </div>

          <button
            className="create-ticket-button"
            type="submit"
            disabled={loading || searchLoading}
          >
            {loading ? "Creating..." : "+ Create Ticket"}
          </button>
        </form>
      )}

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
