import { useState } from "react";

const TaskModal = ({ task, onClose, onSave, onDelete }) => {
  const isNew = !task?._id;
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, priority, dueDate: dueDate || null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded border border-line bg-surface p-6">
        <h2 className="font-display text-base font-semibold text-ink">
          {isNew ? "New task" : "Edit task"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="font-body text-sm text-muted">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm text-ink outline-none focus:border-accent"
              placeholder="What needs doing?"
            />
          </div>
          <div>
            <label className="font-body text-sm text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded border border-line px-3 py-2 font-body text-sm text-ink outline-none focus:border-accent"
              placeholder="Add more detail (optional)"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-body text-sm text-muted">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm text-ink outline-none focus:border-accent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="font-body text-sm text-muted">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded border border-line px-3 py-2 font-body text-sm text-ink outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {!isNew && (
                <button
                  type="button"
                  onClick={() => onDelete(task._id)}
                  className="font-body text-sm text-priority-high"
                >
                  Delete task
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-line px-4 py-2 font-body text-sm text-ink hover:border-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-accent px-4 py-2 font-body text-sm text-white hover:bg-accent-dark"
              >
                {isNew ? "Add task" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
