import generateToken from "../utils/genarateToken.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const user = await User.create(userData);
  const token = generateToken(user._id);

  try {
    await sendEmail({
      to: user.email,
      subject: "Welcome to Group 2 Supermarket! 🛒",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2ECC71; text-align: center;">Welcome to Group 2 Supermarket! 🛒</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your account has been created successfully. We're excited to have you on board!</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333;">Your Account Details:</h3>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
          </div>
          <p>You can now log in and start shopping!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a style="background-color: #2ECC71; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping</a>
          </div>
          <p style="color: #888; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Welcome email failed:", emailError.message);
  }

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

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export { register, login, getMe };
