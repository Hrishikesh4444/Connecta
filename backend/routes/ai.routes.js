import express from "express";
import { aiPostAssistant } from "../controllers/ai.controller.js";

const router = express.Router();

// The endpoint will be POST /api/ai/assistant
router.post("/assistant", aiPostAssistant);

export default router;