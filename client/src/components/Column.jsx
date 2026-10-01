import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard.jsx";

const Column = ({ column, onOpenTask, onAddTask }) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setAdding(false);
      return;
    }
    onAddTask(column._id, title);
    setTitle("");
    setAdding(false);
  };

  return (
    <section className={`flex min-h-[55vh] w-[min(84vw,330px)] shrink-0 flex-col overflow-hidden rounded-lg border border-line border-t-[3px] bg-[#F7FAF8] shadow-[0_5px_18px_rgba(23,35,31,0.045)] sm:min-h-[calc(100vh-230px)] ${["border-t-[#18705D]", "border-t-[#D27949]", "border-t-[#6689A0]", "border-t-[#B47A24]"][column.order % 4]}`}>
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <h3 className="font-display text-base font-semibold text-ink">{column.title}</h3>
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#E5EEE9] px-1.5 font-body text-xs font-semibold text-muted">
          {column.tasks.length}
        </span>
      </div>

      <Droppable droppableId={column._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`mx-2 flex-1 rounded-md px-2 pt-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-accent-soft ring-1 ring-inset ring-accent/20" : ""
            }`}
          >
            {column.tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} onOpen={onOpenTask} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-2 pt-3">
        {adding ? (
          <form onSubmit={submit}>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={submit}
              placeholder="Task title"
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 font-body text-sm text-ink outline-none focus:border-accent"
            />
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full rounded-md border border-dashed border-transparent px-3 py-2.5 text-left font-body text-sm font-medium text-muted transition-colors hover:border-line hover:bg-white hover:text-accent"
          >
            <span aria-hidden="true" className="mr-2 text-lg leading-none">+</span>Add task
          </button>
        )}
      </div>
    </section>
  );
};

export default Column;
