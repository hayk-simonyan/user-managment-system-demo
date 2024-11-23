const { users } = require('./data');

const getAllUsers = (req, res) => {
  res.json(users);
};

const getUserById = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

const createUser = (req, res) => {
  const { name, email, role } = req.body;

  // Validation checks
  if (!name || !email || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Role validation
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role.toLowerCase())) {
    return res
      .status(400)
      .json({ message: 'Role must be either "user" or "admin"' });
  }

  // Check for duplicate email
  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    email: email.toLowerCase(),
    role: role.toLowerCase(),
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

const updateUser = (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
};

const deleteUser = (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
