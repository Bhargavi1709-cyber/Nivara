export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = "nivara_users";
const CURRENT_USER_KEY = "nivara_current_user";

// Get all users from localStorage
const getUsers = (): StoredUser[] => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: StoredUser[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Save current user to localStorage
const saveCurrentUser = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Remove current user from localStorage
export const logout = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Simple hash function for password (Note: In production, use proper backend authentication)
const hashPassword = (password: string): string => {
  // This is a simple hash for demo purposes only
  // In production, use proper backend authentication with bcrypt or similar
  return btoa(password);
};

// Verify password
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

// Sign up a new user
export const signup = (
  fullName: string,
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } => {
  if (!fullName || !email || !password) {
    return { success: false, error: "All fields are required" };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters long",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  const users = getUsers();

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "User with this email already exists" };
  }

  // Create new user
  const newUser: StoredUser = {
    id: Date.now().toString(),
    fullName,
    email,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  saveCurrentUser(userWithoutPassword);

  return { success: true, user: userWithoutPassword };
};

// Login a user
export const login = (
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } => {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  if (!verifyPassword(password, user.password)) {
    return { success: false, error: "Invalid email or password" };
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  saveCurrentUser(userWithoutPassword);

  return { success: true, user: userWithoutPassword };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
