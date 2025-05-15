import { Router } from "express";
import { getCreatorById, creatorList } from "../controller/userController.js";
import { validateToken } from "../middleware/middleware.js";
const router = Router();

router.get("/", creatorList);
router.get("/:userId", getCreatorById);

export default router;