const VALID_USERS = [
  { username: 'user123', password: 'password123' },
  { username: 'admin', password: 'admin@123' },
];

function login(username, password) {
  if (!username || typeof username !== 'string' || username.trim() === '') {
    throw new Error('Username is required.');
  }
  if (!password || typeof password !== 'string' || password === '') {
    throw new Error('Password is required.');
  }
  const match = VALID_USERS.some(
    (u) => u.username === username && u.password === password
  );
  if (!match) {
    throw new Error('Invalid username or password.');
  }
  return { username, token: 'fake-jwt-token' };
}

// Demo
try {
  login('user123', 'password123');
  login('', 'password456'); // Should throw: "Username is required."
  login('user', ''); // Should throw: "Password is required."
  login('invalidUser', 'invalidPassword'); // Should throw: "Invalid username or password."
} catch (error) {
  console.error(error.message);
}

module.exports = { login };