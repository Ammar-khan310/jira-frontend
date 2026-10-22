import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes";
import WorkspaceLayout from "./components/WorkspaceLayout";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateTicket = lazy(() => import("./components/CreateTicket"));
const TicketList = lazy(() => import("./components/TicketList"));
const GlobalChat = lazy(() => import("./components/GlobalChat"));
const TicketDetails = lazy(() => import("./pages/TicketDetails"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading page...</p>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<WorkspaceLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/tickets" element={<TicketList />} />
              <Route path="/global-chat" element={<GlobalChat />} />
            </Route>

            <Route path="/tickets/:id" element={<TicketDetails />} />
          </Route>

          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
