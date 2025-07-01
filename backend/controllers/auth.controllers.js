import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const checkUserName = await User.findOne({ userName });
    if (checkUserName) {
      return res.status(400).json("Username already exists");
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json("email already exists");
    }
    if (password.length < 6) {
      return res.status(400).json("password must be atleast 6 characters");
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, password: hashedPass });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Signup error${error}` });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("user does not exists");
    }
    const matchPass = await bcrypt.compare(password, user.password);

    if (!matchPass) {
      return res.status(400).json("Incorrect Password");
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `login error${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout error ${error}` });
  }
};
