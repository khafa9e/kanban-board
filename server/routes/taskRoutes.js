import express from "express";
import { updateTask, deleteTask, moveTask } from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/:id").put(updateTask).delete(deleteTask);
router.patch("/:id/move", moveTask);

export default router;
