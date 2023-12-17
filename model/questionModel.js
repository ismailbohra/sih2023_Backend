import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "attentionSpan",
      "decisionMaking",
      "mathematics",
      "communication",
      "timeManagement",
      "reasoning",
    ],
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["audio", "textual", "video", "image"],
  },
  options: [
    {
      value: {
        type: String,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
    },
  ],
  link: {
    type: String,
    default: "",
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
