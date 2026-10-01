import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const loadBoards = async () => {
    setLoading(true);
    const { data } = await api.get("/boards");
    setBoards(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { data } = await api.post("/boards", { title });
    setBoards((prev) => [data, ...prev]);
    setTitle("");
    setCreating(false);
  };

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-9 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6 sm:pb-8">
        <div>
          <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.14em] text-accent">Workspace</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Your boards<span className="text-[#D27949]">.</span></h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-md bg-ink px-4 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-md"
        >
          <span aria-hidden="true" className="mr-2 text-[#9AD6B7]">+</span>New board
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="mt-6 flex flex-wrap gap-2 rounded-lg border border-line bg-white p-3 shadow-sm">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board name"
            className="min-w-0 flex-1 rounded-md border border-line bg-paper px-3 py-2.5 font-body text-sm outline-none transition-colors focus:border-accent sm:max-w-sm"
          />
          <button type="submit" className="rounded-md bg-accent px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-dark">
            Create
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="rounded-md border border-line px-4 py-2 font-body text-sm text-ink transition-colors hover:bg-paper"
          >
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <p className="mt-10 font-body text-sm text-muted">Loading boards...</p>
      ) : boards.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-line bg-white/70 px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold text-ink">A clear board starts here.</p>
          <p className="mt-2 font-body text-sm text-muted">Create your first board to get moving.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {boards.map((board, index) => (
            <Link
              key={board._id}
              to={`/boards/${board._id}`}
              className={`group relative min-h-36 overflow-hidden rounded-lg border border-line border-t-[3px] bg-white p-5 shadow-[0_2px_8px_rgba(23,35,31,0.035)] transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_28px_rgba(23,35,31,0.09)] ${[
                "border-t-[#18705D]",
                "border-t-[#D27949]",
                "border-t-[#6689A0]",
                "border-t-[#B47A24]",
              ][index % 4]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Board {String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 break-words font-display text-xl font-semibold leading-tight text-ink">{board.title}</h2>
                </div>
                <span aria-hidden="true" className="mt-1 text-xl text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">↗</span>
              </div>
              <p className="mt-5 font-body text-xs text-muted">
                Created {new Date(board.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default Boards;
