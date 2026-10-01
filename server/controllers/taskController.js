import Task from "../models/Task.js";
import Column from "../models/Column.js";
import Board from "../models/Board.js";
import { canAccessBoard } from "./boardController.js";

// @desc    Add a task to a column
// @route   POST /api/columns/:columnId/tasks
export const createTask = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const column = await Column.findById(columnId);
    if (!column) return res.status(404).json({ message: "Column not found" });

    const board = await Board.findById(column.board);
    if (!canAccessBoard(board, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lastTask = await Task.findOne({ column: columnId }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      column: columnId,
      board: board._id,
      order,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Edit a task's fields
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const board = await Board.findById(task.board);
    if (!canAccessBoard(board, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const board = await Board.findById(task.board);
    if (!canAccessBoard(board, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Move a task to a new column/position (drag and drop)
// @route   PATCH /api/tasks/:id/move
// @body    { destinationColumnId, destinationIndex }
export const moveTask = async (req, res) => {
  try {
    const { destinationColumnId, destinationIndex } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const board = await Board.findById(task.board);
    if (!canAccessBoard(board, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const sourceColumnId = task.column.toString();
    const targetColumnId = destinationColumnId || sourceColumnId;

    // Pull the task out of its source column's ordering
    const sourceTasks = await Task.find({ column: sourceColumnId }).sort({ order: 1 });
    const remainingSource = sourceTasks.filter((t) => t._id.toString() !== task._id.toString());

    if (sourceColumnId === targetColumnId) {
      remainingSource.splice(destinationIndex, 0, task);
      await Promise.all(
        remainingSource.map((t, index) => Task.findByIdAndUpdate(t._id, { order: index }))
      );
    } else {
      await Promise.all(
        remainingSource.map((t, index) => Task.findByIdAndUpdate(t._id, { order: index }))
      );

      const destTasks = await Task.find({ column: targetColumnId }).sort({ order: 1 });
      destTasks.splice(destinationIndex, 0, task);

      task.column = targetColumnId;
      await task.save();

      await Promise.all(
        destTasks.map((t, index) => Task.findByIdAndUpdate(t._id, { order: index }))
      );
    }

    const updatedTask = await Task.findById(task._id);
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
