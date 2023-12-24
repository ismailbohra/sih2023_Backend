import express from "express";
import { aicontroller, getQuestionController } from "../controller/trainingController.js";
const router = express.Router();


router.post("/getquestion", getQuestionController);
router.post("/aicontroller", aicontroller);

export default router;
