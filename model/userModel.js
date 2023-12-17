import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true,
  },
  // Common fields for both students and teachers
  remedies: {
    type: [String],
    default: [],
  },
  // Additional fields based on the user role
  // For students
  reasoning: {
    type: Number,
    default: 0,
  },
  timeManagement: {
    type: Number,
    default: 0,
  },
  communication: {
    type: Number,
    default: 0,
  },
  mathematics: {
    type: Number,
    default: 0,
  },
  decisionMaking: {
    type: Number,
    default: 0,
  },
  attentionSpan: {
    type: Number,
    default: 0,
  },
  // For teachers
  subjects: [
    {
      subject: {
        type: String,
        required: true,
      },
      categories: [
        {
          type: mongoose.ObjectId,
          ref: 'Category',
        },
      ],
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
