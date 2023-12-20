import express from "express";
import { getQuestionController } from "../controller/trainingController.js";
const router = express.Router();


router.post("/getquestion", getQuestionController);

export default router;
