import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(name, email, password);
    if (ok) navigate("/");
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded border border-line bg-surface p-8">
        <h1 className="font-display text-xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 font-body text-sm text-muted">Set up boards for yourself or your team.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="font-body text-sm text-muted">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="font-body text-sm text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="font-body text-sm text-muted">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm outline-none focus:border-accent"
            />
          </div>

          {error && <p className="font-body text-sm text-priority-high">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-accent px-4 py-2 font-body text-sm text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 font-body text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
