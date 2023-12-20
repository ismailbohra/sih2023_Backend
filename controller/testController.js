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

    if (!answer || answer.length < 5) {
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
      let maximumscore = 0;
      let tempquestion = allquestion.filter((e) => e.category == element);
      tempquestion.forEach((tempelement) => {
        let tempresponse = answer.find((e) => e.question_id == tempelement._id);
        temptotal =
          temptotal + tempelement.options[tempresponse.response].weight;
        if (element == "mathematics") {
          console.log(tempelement.options[tempresponse.response].weight);
          console.log(`${findMaxWeightOption(tempelement)}`);
        }
        maximumscore += findMaxWeightOption(tempelement);
      });
      marks.push({
        category: element,
        score: temptotal,
      });

      temptotal = (temptotal / maximumscore) * 100;
      if (temptotal < 15) {
        update_marks[element] = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
      } else {
        update_marks[element] = temptotal;
      }
    });
    function findMaxWeightOption(question) {
      let maxWeight = -1; // Initialize with a value lower than any possible weight
      let maxWeightOption = null;
      question.options.forEach((option) => {
        if (option.weight > maxWeight) {
          maxWeight = option.weight;
          maxWeightOption = option;
        }
      });

      return maxWeightOption.weight;
    }

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
        let valueto = update_marks[category] / 10;
        return {
          category: element,
          value: valueto,
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

    const randomQuestions = [];

    for (const category of categories) {
      // Fetch one random question of each type for the current category
      const randomImageQuestion = await Question.aggregate([
        { $match: { category, type: "image" } },
        { $sample: { size: 1 } },
      ]);

      const randomTextualQuestion = await Question.aggregate([
        { $match: { category, type: "textual" } },
        { $sample: { size: 1 } },
      ]);

      const randomAudioQuestion = await Question.aggregate([
        { $match: { category, type: "Audio" } },
        { $sample: { size: 1 } },
      ]);

      // Push the randomly selected questions to the array
      randomQuestions.push(
        ...randomImageQuestion,
        ...randomTextualQuestion,
        ...randomAudioQuestion
      );
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
