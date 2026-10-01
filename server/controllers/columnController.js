import Column from "../models/Column.js";
import Board from "../models/Board.js";
import Task from "../models/Task.js";
import { canAccessBoard } from "./boardController.js";

// @desc    Add a column to a board
// @route   POST /api/boards/:boardId/columns
export const createColumn = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Column title is required" });

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (!canAccessBoard(board, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lastColumn = await Column.findOne({ board: boardId }).sort({ order: -1 });
    const order = lastColumn ? lastColumn.order + 1 : 0;

    const column = await Column.create({ title, board: boardId, order });
    res.status(201).json({ ...column.toObject(), tasks: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Rename a column or change its order
// @route   PUT /api/columns/:id
export const updateColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);
    if (!column) return res.status(404).json({ message: "Column not found" });

    const board = await Board.findById(column.board);
    if (!canAccessBoard(board, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.body.title !== undefined) column.title = req.body.title;
    if (req.body.order !== undefined) column.order = req.body.order;
    await column.save();
    res.json(column);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a column and its tasks
// @route   DELETE /api/columns/:id
export const deleteColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);
    if (!column) return res.status(404).json({ message: "Column not found" });

    const board = await Board.findById(column.board);
    if (!canAccessBoard(board, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Task.deleteMany({ column: column._id });
    await column.deleteOne();
    res.json({ message: "Column deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
