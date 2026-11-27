import User from "./schemas/users.js";
import Role from "./schemas/roles.js";
import bcrypt from "bcrypt";

const createUser = async (name, email, password) => {
  const customer = await Role.findOne({ name: 'customer' });
  if (!customer) throw new Error('Default role not found');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: customer._id
  });

  return user._id.toString();
};

const getAllUsers = async () => {
  return User.find().select('-passwordHash').populate('role');
};

const getUserById = async (id) => {
  return User.findById(id).select('-passwordHash').populate('role');
};

const updateUser = async (id, updateData) => {
  return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-passwordHash').populate('role');
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};
const findUserByEmail = async (email) => {
  return User.findOne({ email }).populate('role');
};

const verifyPassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

export { createUser, findUserByEmail, verifyPassword, getAllUsers, getUserById, updateUser, deleteUser  }; 