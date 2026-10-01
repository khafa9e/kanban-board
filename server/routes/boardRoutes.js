import express from "express";
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard } from "../controllers/boardController.js";
import { createColumn } from "../controllers/columnController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getBoards).post(createBoard);
router.route("/:id").get(getBoard).put(updateBoard).delete(deleteBoard);
router.post("/:boardId/columns", createColumn);

export default router;
