const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { getByEmail, create, setNewPassword } = require("../models/account");
const {
  validateAccount,
  AccoutLogin,
  AccoutRegister,
} = require("../models/account/validate");
const { getSection } = require("../models/config");

const login = async (req, res) => {
  try {
    await validateAccount(req.body, AccoutLogin);
    const { email, password } = req.body;

    const account = await getByEmail(email);

    if (!account) {
      return res.status(400).send("Account not found!");
    }

    if (!bcrypt.compareSync(password, account.password)) {
      return res.status(400).send("Wrong password!");
    }

    const payload = {
      username: account.username,
      email: account.email,
      id: account._id,
      exp: new Date() / 1000 + 7 * 24 * 60 * 60,
    };

    const token = jwt.sign(payload, getSection("development").jwt_secret);

    return res.status(200).send({ token });
  } catch (err) {
    console.err(err);
    return res.status(500).send("Internal Server Error!");
  }
};

const register = async (req, res) => {
  try {
    await validateAccount(req.body, AccoutRegister);
    const { username, email, password, confirmPassword } = req.body;

    const exist = await getByEmail(email);
    if (exist) {
      return res.status(400).send("Account with this email already exists!");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match!");
    }

    const data = {
      username,
      email,
      password: bcrypt.hashSync(password),
    };

    const account = await create(data);
    return res.status(200).send(account);
  } catch (err) {
    console.err(err);
    return res.status(500).send("Internal Server Error!");
  }
};

const refreshToken = async (req, res) => {
  const payload = {
    ...req.auth, 
    exp: new Date() / 1000 + 7 * 24 * 60 * 60, 
  };

  const token = jwt.sign(payload, getSection("development".jwt_secret));

  return res.status(200).send({ token });
};

const resetPassword = async (req, res) => {
  
  const { email, newPassword, confirmPassword } = req.body;

  try {
    const account = await getByEmail(email);

    if (!account) {
      return res.status(400).send("Account not found!");
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send("Passwords do not match!");
    }

    if (bcrypt.compareSync(newPassword, account.password)) {
      return res.status(400).send("New password cannot be old password!");
    }

    const newHashedPassword = bcrypt.hashSync(newPassword);

    const userPasswordChanged = await setNewPassword(
      account._id.toString(),
      newHashedPassword
    );

    return res.status(200).send(userPasswordChanged);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error!");
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  resetPassword,
};