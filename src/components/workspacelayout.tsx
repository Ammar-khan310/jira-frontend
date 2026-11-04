import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout } from "../redux/slices/authSlice";
import api from "../api/axios";
import {
  setWorkspaces,
  setSelectedWorkspace,
  setWorkspaceLoading,
} from "../redux/slices/workspaceSlice";

function WorkspaceLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const workspaces = useAppSelector((state) => state.workspace.workspaces);
  const selectedWorkspace = useAppSelector(
    (state) => state.workspace.selectedWorkspace,
  );
  const loading = useAppSelector((state) => state.workspace.loading);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const fetchWorkspaces = async () => {
    try {
      dispatch(setWorkspaceLoading(true));

      const response = await api.get("/workspaces");

      dispatch(setWorkspaces(response.data.workspaces || []));
    } catch (error) {
      console.error("Failed to load workspaces:", error);
      setMessage("Workspaces load nahi ho sake. Please try again.");
    } finally {
      dispatch(setWorkspaceLoading(false));
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setMessage("");

    const name = workspaceName.trim();

    if (!name) {
      setMessage("Workspace ka naam enter karo.");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post("/workspaces", { name });
      const newWorkspace = response.data.workspace;

      if (!newWorkspace) {
        setMessage(
          "Workspace create hua, lekin response mein workspace nahi mila.",
        );
        return;
      }

      await fetchWorkspaces();

      dispatch(setSelectedWorkspace(newWorkspace));

      setWorkspaceName("");
      setShowCreateForm(false);
      setMessage("Workspace successfully create ho gaya!");
    } catch (error: any) {
      console.error("Create workspace error:", error);

      setMessage(
        error.response?.data?.message ||
          "Workspace create nahi ho saka. Please try again.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleCreateInvite = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setInviteMessage("");
    setInviteLink("");

    if (!selectedWorkspace) {
      setInviteMessage("Pehle workspace select karo.");
      return;
    }

    const email = inviteEmail.trim().toLowerCase();

    if (!email) {
      setInviteMessage("Member ki email enter karo.");
      return;
    }

    try {
      setCreatingInvite(true);

      const response = await api.post(
        `/workspace-invites/${selectedWorkspace.id}/invite`,
        { email },
      );

      const token = response.data.invitation?.inviteToken;

      if (!token) {
        setInviteMessage("Invitation token response mein nahi mila.");
        return;
      }

      const link = `${window.location.origin}/accept-invite?token=${encodeURIComponent(token)}`;

      setInviteLink(link);
      setInviteMessage(
        "Invitation create ho gayi! Link copy karke member ko share karo.",
      );
      setInviteEmail("");
    } catch (error: any) {
      console.error("Create invitation error:", error);

      setInviteMessage(
        error.response?.data?.message ||
          "Invitation create nahi ho saki. Please try again.",
      );
    } finally {
      setCreatingInvite(false);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setInviteMessage("Invitation link copy ho gaya!");
    } catch {
      setInviteMessage(
        "Link copy nahi hua. Link ko manually select karke copy karo.",
      );
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setWorkspaces([]));
    dispatch(setSelectedWorkspace(null));
    navigate("/login");
  };

  return (
    <div className="workspace-layout">
      <aside className="workspace-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">J</span>
          <span>Jira Workspace</span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <div className="workspace-selector">
          <label htmlFor="workspace-select">Select workspace</label>

          <select
            id="workspace-select"
            value={selectedWorkspace?.id ?? ""}
            disabled={loading || workspaces.length === 0}
            onChange={(event) => {
              const workspace = workspaces.find(
                (item) => item.id === Number(event.target.value),
              );

              if (workspace) {
                dispatch(setSelectedWorkspace(workspace));
                setInviteMessage("");
                setInviteLink("");
              }
            }}
          >
            {loading && <option value="">Loading...</option>}

            {!loading && workspaces.length === 0 && (
              <option value="">No workspaces found</option>
            )}

            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="sidebar-link"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setMessage("");
            }}
          >
            + Create Workspace
          </button>

          {showCreateForm && (
            <form onSubmit={handleCreateWorkspace}>
              <label htmlFor="workspace-name">Workspace name</label>

              <input
                id="workspace-name"
                type="text"
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                placeholder="Enter workspace name"
                maxLength={100}
                required
              />

              <button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </button>

              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </form>
          )}

          {selectedWorkspace?.role === "OWNER" && (
            <div>
              <button
                type="button"
                className="sidebar-link"
                onClick={() => {
                  setShowInviteForm(!showInviteForm);
                  setInviteMessage("");
                  setInviteLink("");
                }}
              >
                + Invite Member
              </button>

              {showInviteForm && (
                <form onSubmit={handleCreateInvite}>
                  <label htmlFor="invite-email">Registered member email</label>

                  <input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="member@example.com"
                    required
                  />

                  <button type="submit" disabled={creatingInvite}>
                    {creatingInvite ? "Creating invite..." : "Generate Link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteEmail("");
                      setInviteMessage("");
                      setInviteLink("");
                    }}
                  >
                    Cancel
                  </button>

                  {inviteMessage && <p role="status">{inviteMessage}</p>}

                  {inviteLink && (
                    <div>
                      <label htmlFor="invite-link">Invitation link</label>

                      <input
                        id="invite-link"
                        type="text"
                        value={inviteLink}
                        readOnly
                        onFocus={(event) => event.target.select()}
                      />

                      <button type="button" onClick={handleCopyInviteLink}>
                        Copy Invite Link
                      </button>

                      <p>
                        Link 24 hours mein expire hoga aur sirf ek baar use kiya
                        ja sakta hai.
                      </p>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {message && <p role="status">{message}</p>}
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/create-ticket"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Create Ticket
          </NavLink>

          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            All Tickets
          </NavLink>

          <NavLink
            to="/global-chat"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Global Chat
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name || "User"}</strong>
            <span>{selectedWorkspace?.role || "Workspace Member"}</span>
          </div>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="workspace-main">
        {selectedWorkspace ? (
          <Outlet />
        ) : (
          <div>
            <h2>Welcome to Jira Workspace</h2>
            <p>
              {loading
                ? "Loading workspaces..."
                : "Abhi koi workspace nahi hai. Start karne ke liye Create Workspace par click karo."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkspaceLayout;
