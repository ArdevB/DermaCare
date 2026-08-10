import userService from "../services/userService.js";

const createUser = async (req, res) => {
  try {
    const data = await userService.createUser(req.body);

    res.status(201).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).send({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const data = await userService.getUsers();

  res.status(200).json(data);
};

const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await userService.updateUser(id, req.body, req.user);

    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await userService.getUserById(id);

    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).send({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await userService.deleteUser(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).send({ error: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  const id = req.params.id;
  const file = req.file;

  try {
    const data = await userService.updateProfileImage(id, file, req.user);

    res.json(data);
  } catch (error) {
    res.status(error.statusCode || 500).send({ error: error.message });
  }
};

const createMerchant = async (req, res) => {
  const userId = req.body.userId;
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const data = await userService.createMerchant(userId);

    res.json(data);
  } catch (error) {
    res.status(error.statusCode || 500).send({ error: error.message });
  }
};

export default {
  createUser,
  getUser,
  updateUser,
  getUserById,
  deleteUser,
  updateProfileImage,
  createMerchant,
};
