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
      performanceMetrics = [
        {
          title: "Rasoning",
          color: {
            backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
            boxShadow: "0px 10px 20px 0px #e0c6f5",
          },
          barValue: user.reasoning * 10,
          value: "25,970",
          png: UilUsdSquare,
          series: [
            {
              name: "Sales",
              data: [31, 40, 28, 51, 42, 109, 100],
            },
          ],
        },
        {
          title: "Time Management",
          color: {
            backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
            boxShadow: "0px 10px 20px 0px #FDC0C7",
          },
          barValue: user.timeManagement * 10,
          value: "14,270",
          png: UilMoneyWithdrawal,
          series: [
            {
              name: "Revenue",
              data: [10, 100, 50, 70, 80, 30, 40],
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
          barValue: user.communication * 10,
          value: "4,270",
          png: UilClipboardAlt,
          series: [
            {
              name: "Expenses",
              data: [10, 25, 15, 30, 12, 15, 20],
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
          barValue: user.mathematics * 10,
          value: "4,270",
          png: UilClipboardAlt,
          series: [
            {
              name: "Expenses",
              data: [10, 25, 15, 30, 12, 15, 20],
            },
          ],
        },
        {
          title: "Decision Making",
          color: {
            backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
            boxShadow: "0px 10px 20px 0px #FDC0C7",
          },
          barValue: user.decisionMaking * 10,
          value: "14,270",
          png: UilMoneyWithdrawal,
          series: [
            {
              name: "Revenue",
              data: [10, 100, 50, 70, 80, 30, 40],
            },
          ],
        },
        {
          title: "Attention Span",
          color: {
            backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
            boxShadow: "0px 10px 20px 0px #e0c6f5",
          },
          barValue: user.attentionSpan * 10,
          value: "25,970",
          png: UilUsdSquare,
          series: [
            {
              name: "Sales",
              data: [31, 40, 28, 51, 42, 109, 100],
            },
          ],
        },
      ];
    }
    res.status(200).send({
      user: user.username,
      performanceMetrics,
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
