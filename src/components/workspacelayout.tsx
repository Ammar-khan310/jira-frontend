import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout } from "../redux/slices/authSlice";

function WorkspaceLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
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

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>▦</span> Dashboard
          </NavLink>

          <NavLink
            to="/create-ticket"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>＋</span> Create Ticket
          </NavLink>

          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>☷</span> All Tickets
          </NavLink>

          <NavLink
            to="/global-chat"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span>◉</span> Global Chat
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name || "User"}</strong>
            <span>Workspace Member</span>
          </div>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="workspace-main">
        <Outlet />
      </main>
    </div>
  );
}

export default WorkspaceLayout;
