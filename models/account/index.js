const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const AccountsModel = mongoose.model("Account", accountSchema, "accounts");

const read = async () => {
  return await AccountsModel.find();
};

const create = async (data) => {
  const newAccount = new AccountsModel(data);
  return await newAccount.save();
};

const update = async (_id, data) => {
  return await AccountsModel.updateOne({ _id }, data);
};

const setNewPassword = async (id, password) => {
  return await AccountsModel.updateOne({ _id: id }, { password });
};

const remove = async (_id) => {
  return await AccountsModel.deleteOne({ _id });
};

const getByEmail = async (email) => {
  return await AccountsModel.findOne({ email });
};

module.exports = {
  read,
  create,
  update,
  remove,
  getByEmail,
  setNewPassword,
};