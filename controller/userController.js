import User from "../model/userModel.js";
import { hashPassword, comparePassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    //validation
    if (!username) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }

    //check user
    const exisitingUser = await User.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //hash the password
    const hashedPassword = await hashPassword(password);
    //save
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
      role,
    }).save();

    // Preparing the user details for response
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    // compare password entered by user and password stored in the database for this user
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token generation
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const userDetailsController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let performanceMetrics = {};
    if (user.role === "student") {
      let history_reasoning = user.history.find(
        (e) => e.category == "reasoning"
      ).value;
      let history_timeManagement = user.history.find(
        (e) => e.category == "timeManagement"
      ).value;
      let history_communication = user.history.find(
        (e) => e.category == "communication"
      ).value;
      let history_mathematics = user.history.find(
        (e) => e.category == "mathematics"
      ).value;
      let history_decisionMaking = user.history.find(
        (e) => e.category == "decisionMaking"
      ).value;
      let history_attentionSpan = user.history.find(
        (e) => e.category == "attentionSpan"
      ).value;

      performanceMetrics = [
        {
          title: "Reasoning",
          color: {
            backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
            boxShadow: "0px 10px 20px 0px #e0c6f5",
          },
          barValue: user.reasoning,
          value: "25,970",
          series: [
            {
              name: "Reasoning",
              data: history_reasoning,
            },
          ],
        },
        {
          title: "Time Management",
          color: {
            backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
            boxShadow: "0px 10px 20px 0px #FDC0C7",
          },
          barValue: user.timeManagement,
          value: "14,270",
          series: [
            {
              name: "Time Management",
              data: history_timeManagement,
            },
          ],
        },
        {
          title: "Communication",
          color: {
            backGround:
              "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
            boxShadow: "0px 10px 20px 0px #F9D59B",
          },
          barValue: user.communication,
          value: "4,270",
          series: [
            {
              name: "Communication",
              data: history_communication,
            },
          ],
        },
        {
          title: "Mathematics",
          color: {
            backGround:
              "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
            boxShadow: "0px 10px 20px 0px #F9D59B",
          },
          barValue: user.mathematics / 2 + user.academic_maths / 2,
          value: "4,270",
          series: [
            {
              name: "Mathematics",
              data: history_mathematics,
            },
          ],
        },
        {
          title: "Decision Making",
          color: {
            backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
            boxShadow: "0px 10px 20px 0px #FDC0C7",
          },
          barValue: user.decisionMaking,
          value: "14,270",
          series: [
            {
              name: "Decision Making",
              data: history_decisionMaking,
            },
          ],
        },
        {
          title: "Attention Span",
          color: {
            backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
            boxShadow: "0px 10px 20px 0px #e0c6f5",
          },
          barValue: user.attentionSpan,
          value: "25,970",
          series: [
            {
              name: "Attention Span",
              data: history_attentionSpan,
            },
          ],
        },
        {
          title: "Literature",
          color: {
            backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
            boxShadow: "0px 10px 20px 0px #e0c6f5",
          },
          barValue: user.academic_literature,
          value: "25,970",
          series: [
            {
              name: "Attention Span",
              data: history_attentionSpan,
            },
          ],
        },
        {
          title: "Social Science",
          color: {
            backGround:
              "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
            boxShadow: "0px 10px 20px 0px #F9D59B",
          },
          barValue: user.academic_socialscience,
          value: "25,970",
          series: [
            {
              name: "Attention Span",
              data: history_attentionSpan,
            },
          ],
        },
      ];
    }
    const self = [
      "reasoning",
      "timeManagement",
      "communication",
      "mathematics",
      "decisionMaking",
      "attentionSpan",
    ];
    const teacher = [
      "academic_socialscience",
      "academic_literature",
      "academic_maths",
      "behaviour",
      "extra_curricular",
    ];
    let selftotal = 0;
    self.forEach((element) => {
      selftotal += user[element];
    });
    let teachertotal = 0;
    teacher.forEach((element) => {
      teachertotal += user[element];
    });
    let finalvalue = (selftotal / 600) * 50 + (teachertotal / 500) * 50;
    console.log(finalvalue);
    console.log("total", selftotal, teachertotal);
    res.status(200).send({
      user: user.username,
      performanceMetrics,
      facultyFeedback: user.faculty_feedback,
      userdata: {
        email: user.email,
        username: user.username,
      },
      finalvalue:finalvalue,
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

export const updateController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, password } = req.body;
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username || user.username,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating user details",
      error,
    });
  }
};

export const deleteStudentController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    res.status(200).send({
      success: true,
      message: "Profile Deleted Successfully",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting student",
      error,
    });
  }
};

export const deleteTeacherController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "teacher") {
      return res.status(404).json({ message: "User is not a teacher" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    res.status(200).send({
      success: true,
      message: "Profile Deleted Successfully",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting teacher",
      error,
    });
  }
};

export const deleteStudentByTeacherController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    res.status(200).send({
      success: true,
      message: "Profile Deleted Successfully",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting student by teacher",
      error,
    });
  }
};
