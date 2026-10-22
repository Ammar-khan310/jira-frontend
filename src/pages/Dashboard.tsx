import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchTickets } from "../redux/slices/ticketSlice";

function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const { tickets, loading, error } = useAppSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const totalTickets = tickets.length;
  const todoTickets = tickets.filter(
    (ticket) => ticket.status === "To Do",
  ).length;
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress",
  ).length;
  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "Pending",
  ).length;
  const completeTickets = tickets.filter(
    (ticket) => ticket.status === "Complete",
  ).length;

  const recentTickets = [...tickets]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || "User"}!</p>
        </div>

        <span className="dashboard-welcome-badge">My Workspace</span>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-overview-heading">
          <h2>Overview</h2>
          <p>Here is what's happening in your workspace.</p>
        </div>

        {error && <p className="ticket-error">Error: {error}</p>}

        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <span>Total Tickets</span>
              <span className="stat-icon">▤</span>
            </div>
            <h2>{loading ? "..." : totalTickets}</h2>
            <p>All workspace tickets</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <span>To Do</span>
              <span className="stat-icon todo-icon">◷</span>
            </div>
            <h2>{loading ? "..." : todoTickets}</h2>
            <p>Tickets waiting to start</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <span>In Progress</span>
              <span className="stat-icon progress-icon">↻</span>
            </div>
            <h2>{loading ? "..." : inProgressTickets}</h2>
            <p>Currently being worked on</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <span>Pending</span>
              <span className="stat-icon pending-icon">◴</span>
            </div>
            <h2>{loading ? "..." : pendingTickets}</h2>
            <p>Waiting for an update</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <span>Complete</span>
              <span className="stat-icon complete-icon">✓</span>
            </div>
            <h2>{loading ? "..." : completeTickets}</h2>
            <p>Completed tickets</p>
          </div>
        </div>

        <section className="dashboard-section recent-tickets-section">
          <div className="recent-tickets-heading">
            <div>
              <h2>Recent Tickets</h2>
              <p>Your latest workspace tickets</p>
            </div>

            <button onClick={() => navigate("/tickets")}>View All</button>
          </div>

          {loading ? (
            <p>Loading recent tickets...</p>
          ) : recentTickets.length === 0 ? (
            <div className="recent-tickets-empty">
              <span>▤</span>
              <h3>No tickets yet</h3>
              <p>Your recent tickets will appear here.</p>
              <button onClick={() => navigate("/create-ticket")}>
                Create Your First Ticket
              </button>
            </div>
          ) : (
            <div className="recent-ticket-list">
              {recentTickets.map((ticket) => (
                <div className="recent-ticket-row" key={ticket.id}>
                  <div className="recent-ticket-info">
                    <span className="ticket-id">Ticket #{ticket.id}</span>
                    <h3>{ticket.title}</h3>
                    <p>{ticket.description || "No description provided."}</p>
                  </div>

                  <div className="recent-ticket-right">
                    <span
                      className={`status-badge status-${ticket.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {ticket.status}
                    </span>

                    <button
                      className="secondary-button"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
