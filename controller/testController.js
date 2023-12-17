import User from "../model/userModel.js";
import Question from "../model/questionModel.js";

export const insertTestResponseController = async (req, res) => {
    try {
      // const userId = req.body.userId;
  
      // const user = await User.findById(userId);
      // if (!user) {
      //   return res.status(404).json({ message: "User not found" });
      // }
  
      const { answer } = req.body;
      const dummyanswer = [
        {
          question_id: 1,
          response: 1,
        },
      ];
  
      let allquestion = [];
  
      // Use await here
      await Promise.all(
        answer.map(async (element) => {
          const question = await Question.findOne({ _id: element.question_id });
          allquestion.push(question);
        })
      );
  
      let category = [
        'reasoning',
        'timeManagement',
        'communication',
        'mathematics',
        'decisionMaking',
        'attentionSpan',
      ];
  
      let marks = [];
      category.forEach((element) => {
        let temptotal = 0;
        let tempquestion = allquestion.filter((e) => e.category == element);
        tempquestion.forEach((tempelement) => {
          let tempresponse = answer.find(
            (e) => e.question_id == tempelement._id
          );
          temptotal = temptotal+tempelement.options[tempresponse.response].weight;
        });
        marks.push({
          category: element,
          score: temptotal,
        });
      });
      console.log(marks);
  
      // if (!answer || answer.length < 10) {
      //   return res.status(404).json({ message: "Answer not found" });
      // }
      // console.log(answer);
  
      // const updatedUser = await User.findByIdAndUpdate(
      //   userId,
      //   {
      //     username: username || user.username,
      //     password: hashedPassword || user.password,
      //   },
      //   { new: true }
      // );
      res.status(200).send({
        success: true,
        message: 'Successfully',
        marks,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error while updating',
        error,
      });
    }
  };

export const getQuestionController = async (req, res) => {
  try {
    const categories = await Question.distinct("category");
    console.log(categories)

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
