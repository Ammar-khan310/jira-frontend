import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authService";
import { useAppDispatch } from "../hooks/reduxHooks";
import { loginSuccess } from "../redux/slices/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        }),
      );

      navigate("/dashboard");
    } catch {
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">J</span>
          <span>Jira Workspace</span>
        </div>

        <div className="auth-heading">
          <h1>Welcome back!</h1>
          <p>Sign in to continue to your workspace.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="auth-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to Workspace"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
