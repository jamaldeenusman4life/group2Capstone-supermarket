import generateToken from "../utils/genarateToken.js";
import User from "../models/userModel.js";

const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const user = await User.create(userData);
  const token = generateToken(user._id);

  return { user, token };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await user.correctPassword(password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account has been deactivated");
  }

  const token = generateToken(user._id);
  return { user, token };
};

const getUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export { register, login, getUser };
