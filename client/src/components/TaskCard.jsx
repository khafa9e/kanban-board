import { Draggable } from "@hello-pangea/dnd";

const priorityColor = {
  high: "border-l-priority-high",
  medium: "border-l-priority-medium",
  low: "border-l-priority-low",
};

const priorityLabel = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const TaskCard = ({ task, index, onOpen }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <button
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpen(task)}
          className={`mb-2 w-full rounded-md border border-line border-l-[3px] ${priorityColor[task.priority]} bg-white px-3.5 py-3 text-left shadow-[0_2px_5px_rgba(23,35,31,0.035)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#B7C9BE] hover:shadow-[0_7px_16px_rgba(23,35,31,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ? "rotate-[1deg] border-accent shadow-lg ring-2 ring-accent/20" : ""
          }`}
        >
          <p className="break-words font-body text-sm font-semibold leading-snug text-ink">{task.title}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className={`rounded px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide ${task.priority === "high" ? "bg-[#F9E9E5] text-priority-high" : task.priority === "low" ? "bg-[#E6F1EB] text-priority-low" : "bg-[#F5EEDC] text-priority-medium"}`}>{priorityLabel[task.priority]}</span>
            {task.dueDate && (
              <span className="font-body text-xs font-medium text-muted">{formatDate(task.dueDate)}</span>
            )}
          </div>
        </button>
      )}
    </Draggable>
  );
};

export default TaskCard;
