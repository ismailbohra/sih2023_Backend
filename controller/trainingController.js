import axios from "axios";
import { academic_data } from "../temp.js";
import User from "../model/userModel.js";

export const getQuestionController = async (req, res) => {
  try {
    const subject_to_train = req.body.subject || "Gereral aptitude question";

    const postData = {
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: `give 5 question of ${subject_to_train} each in json format like question with id on each and its option and correct option index`,
        },
      ],
    };
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const headers = {
      Authorization:
        "Bearer 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",
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(apiUrl, postData, { headers });
      console.log("Response from server:", response.data);

      let temp = JSON.parse(response.data.choices[0].message.content);
      res.status(200).send({
        status: true,
        msg: "success",
        data: temp.questions,
      });
    } catch (error) {
      console.error("Error sending POST request:", error.message);
      res.status(500).send({
        success: false,
        message: "Error in fetching data",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching data",
      error,
    });
  }
};
