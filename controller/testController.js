import User from "../model/userModel.js";
import Question from "../model/questionModel.js";

export const insertTestResponseController = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { answer } = req.body;

    if (!answer || answer.length < 10) {
      return res.status(404).json({ message: "Answer not found" });
    }

    let allquestion = [];

    // Use await here
    await Promise.all(
      answer.map(async (element) => {
        const question = await Question.findOne({ _id: element.question_id });
        allquestion.push(question);
      })
    );

    let category = [
      "reasoning",
      "timeManagement",
      "communication",
      "mathematics",
      "decisionMaking",
      "attentionSpan",
    ];

    let marks = [];
    let update_marks = {};
    category.forEach((element) => {
      let temptotal = 0;
      let tempquestion = allquestion.filter((e) => e.category == element);
      tempquestion.forEach((tempelement) => {
        let tempresponse = answer.find((e) => e.question_id == tempelement._id);
        temptotal =
          temptotal + tempelement.options[tempresponse.response].weight;
      });
      marks.push({
        category: element,
        score: temptotal,
      });
      update_marks[element] = temptotal;
    });

    if (Array.isArray(user.history)) {
      category.forEach((element) => {
        let temp = user.history.find((e) => e.category === element);
        let temp_marks = marks.find((e) => e.category === element).score;

        if (temp) {
          temp.value.push(temp_marks);
        } else {
          // If the category is not found in history, create a new entry
          user.history.push({
            category: element,
            value: [temp_marks],
          });
        }
      });
    } else {
      // If history doesn't exist or is not an array, create a new one
      user.history = category.map((element) => {
        let temp_marks = marks.find((e) => e.category === element);
        return {
          category: element,
          value: [temp_marks ? temp_marks.score : 0],
        };
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        reasoning: update_marks.reasoning,
        timeManagement: update_marks.timeManagement,
        communication: update_marks.communication,
        mathematics: update_marks.mathematics,
        decisionMaking: update_marks.decisionMaking,
        attentionSpan: update_marks.attentionSpan,
        history: user.history,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Successfully",
      marks,
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
    const categories = await Question.distinct("category");
    console.log(categories);

    const randomQuestions = [];

    for (const category of categories) {
      const randomQuestion = await Question.aggregate([
        { $match: { category } },
        { $sample: { size: 2 } },
      ]);

      randomQuestions.push(...randomQuestion);
    }

    res.status(200).send({
      status: true,
      msg: "success",
      data: randomQuestions,
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
