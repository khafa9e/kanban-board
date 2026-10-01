import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import api from "../api/axios.js";
import Column from "../components/Column.jsx";
import TaskModal from "../components/TaskModal.jsx";

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [activeTask, setActiveTask] = useState(null); // { ...task, columnId } or { columnId } for new

  const loadBoard = async () => {
    setLoading(true);
    const { data } = await api.get(`/boards/${id}`);
    setBoard(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) {
      setAddingColumn(false);
      return;
    }
    const { data } = await api.post(`/boards/${id}/columns`, { title: newColumnTitle });
    setBoard((prev) => ({ ...prev, columns: [...prev.columns, data] }));
    setNewColumnTitle("");
    setAddingColumn(false);
  };

  const handleAddTask = async (columnId, title) => {
    const { data } = await api.post(`/columns/${columnId}/tasks`, { title });
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col._id === columnId ? { ...col, tasks: [...col.tasks, data] } : col
      ),
    }));
  };

  const handleSaveTask = async (fields) => {
    if (activeTask._id) {
      const { data } = await api.put(`/tasks/${activeTask._id}`, fields);
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          tasks: col.tasks.map((t) => (t._id === data._id ? data : t)),
        })),
      }));
    }
    setActiveTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t._id !== taskId),
      })),
    }));
    setActiveTask(null);
  };

  const handleDeleteBoard = async () => {
    if (!window.confirm("Delete this board and everything on it?")) return;
    await api.delete(`/boards/${id}`);
    navigate("/");
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setBoard((prev) => {
      const columns = prev.columns.map((col) => ({ ...col, tasks: [...col.tasks] }));
      const sourceCol = columns.find((c) => c._id === source.droppableId);
      const destCol = columns.find((c) => c._id === destination.droppableId);
      const [movedTask] = sourceCol.tasks.splice(source.index, 1);
      destCol.tasks.splice(destination.index, 0, { ...movedTask, column: destCol._id });
      return { ...prev, columns };
    });

    api
      .patch(`/tasks/${draggableId}/move`, {
        destinationColumnId: destination.droppableId,
        destinationIndex: destination.index,
      })
      .catch(() => loadBoard());
  };

  if (loading) {
    return <p className="mx-auto max-w-[1440px] px-5 py-10 font-body text-sm text-muted sm:px-8">Loading board...</p>;
  }

  if (!board) return null;

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5 sm:mb-7 sm:pb-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 font-body text-sm font-medium text-muted transition-colors hover:text-accent">
            <span aria-hidden="true">←</span> All boards
          </Link>
          <p className="mb-1 mt-4 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-accent">Board</p>
          <h1 className="break-words font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">{board.title}</h1>
        </div>
        <button
          onClick={handleDeleteBoard}
          className="rounded-md border border-line bg-white/70 px-3.5 py-2 font-body text-sm font-medium text-priority-high transition-colors hover:border-priority-high hover:bg-[#F9E9E5]"
        >
          Delete board
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex items-stretch gap-4 overflow-x-auto pb-5">
          {board.columns.map((column) => (
            <Column
              key={column._id}
              column={column}
              onOpenTask={(task) => setActiveTask({ ...task, columnId: column._id })}
              onAddTask={handleAddTask}
            />
          ))}

          <div className="w-[min(84vw,330px)] shrink-0 pt-3">
            {addingColumn ? (
              <form onSubmit={handleAddColumn} className="rounded-lg border border-line bg-white p-2 shadow-sm">
                <input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onBlur={handleAddColumn}
                  placeholder="Column name"
                  className="w-full rounded-md border border-line bg-paper px-3 py-2.5 font-body text-sm outline-none focus:border-accent"
                />
              </form>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="flex min-h-12 w-full items-center rounded-lg border border-dashed border-[#B9C9BF] bg-white/55 px-4 py-3 text-left font-body text-sm font-medium text-muted transition-colors hover:border-accent hover:bg-white hover:text-accent"
              >
                <span aria-hidden="true" className="mr-2 text-lg leading-none">+</span>Add column
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      {activeTask && (
        <TaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </main>
  );
};

export default BoardDetail;
