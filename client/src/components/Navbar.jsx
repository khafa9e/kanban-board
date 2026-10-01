import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5 font-display text-lg font-bold text-ink">
          <span className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-md bg-ink p-1.5 transition-transform group-hover:rotate-3" aria-hidden="true">
            <span className="rounded-[2px] bg-[#78C5A3]" />
            <span className="rounded-[2px] bg-[#E7B85D]" />
            <span className="rounded-[2px] bg-[#E27964]" />
            <span className="rounded-[2px] bg-white/80" />
          </span>
          Kanban
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden font-body text-sm text-muted sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-line bg-white px-3.5 py-2 font-body text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-paper"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
