import * as authService from "../services/authService.js";

const registerUser = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await authService.getUser(req.user.id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

export { registerUser, loginUser, getUser };
