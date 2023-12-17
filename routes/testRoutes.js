import express from "express";
import { getQuestionController, insertTestResponseController } from "../controller/testController.js";
const router = express.Router();


router.get("/getquestion", getQuestionController);
router.post("/insertTestResponse", insertTestResponseController);

export default router;
