import express from "express";
import { getQuestionController, getStudentController, insertTestResponseController } from "../controller/facultyController.js";
const router = express.Router();


router.get("/getstudent", getStudentController);
router.get("/getquestion", getQuestionController);
router.post("/insertTestResponse", insertTestResponseController);

export default router;
