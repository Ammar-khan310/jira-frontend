import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  const handleAcceptInvite = async () => {
    if (!token) {
      setMessage("Invitation token is missing or invalid.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/workspace-invites/accept", {
        token,
      });

      setMessage(response.data.message || "Invitation accepted successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Unable to accept invitation. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-3 text-2xl font-bold text-gray-800">
          Join Workspace
        </h1>

        <p className="mb-5 text-gray-600">
          Accept the invitation to become a member of this workspace.
        </p>

        {message && (
          <p className="mb-4 rounded bg-gray-100 p-3 text-sm text-gray-700">
            {message}
          </p>
        )}

        <button
          onClick={handleAcceptInvite}
          disabled={loading || !token}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Accepting..." : "Accept Invitation"}
        </button>

        {!token && (
          <p className="mt-3 text-sm text-red-600">
            The invitation link does not contain a token.
          </p>
        )}
      </div>
    </div>
  );
}

export default AcceptInvite;
