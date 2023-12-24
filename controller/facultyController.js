import User from "../model/userModel.js";
import Question from "../model/questionModel.js";
import { academic_data } from "../temp.js";

export const insertTestResponseController = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { answer } = req.body;

    if (!answer || answer.length < 10) {
      return res.status(400).json({ message: "Answer not found or too short" });
    }

    let index = 0;
    academic_data.forEach((item) => {
      item.answer = { value: answer[index] + 1 };
      index++;
    });

    const category = [
      "academic_literature",
      "academic_socialscience",
      "academic_maths",
      "behaviour",
      "extracurricular",
    ];

    let key_Value = [];

    for (const element of category) {
      let total = 0;
      let temp_answer = academic_data.filter((e) => e.category === element);
      let max = temp_answer.length * 5;

      if (temp_answer.length > 0) {
        for (const temp_element of temp_answer) {
          total += temp_element.answer.value;
        }
      }

      var value = (total / max) * 100 || 0;

      key_Value.push({
        key: element,
        score: value,
      });
    }

    key_Value.forEach(async (element) => {
      if (element.score) {
        await User.findByIdAndUpdate(
          userId,
          {
            [element.key]: element.score,
          },
          { new: true }
        );
      }
    });
    await User.findByIdAndUpdate(userId, {
      faculty_feedback: 1,
    });

    res.status(200).send({
      success: true,
      message: "Successfully updated user scores",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating",
      error,
    });
  }
};

export const getQuestionController = async (req, res) => {
  try {
    res.status(200).send({
      status: true,
      msg: "success",
      data: academic_data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching data",
      error,
    });
  }
};
export const getStudentController = async (req, res) => {
  const students = await User.find({ role: "student" });
  try {
    res.status(200).send({
      status: true,
      msg: "success",
      data: students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching data",
      error,
    });
  }
};
