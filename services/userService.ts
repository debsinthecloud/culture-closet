
import { User, Order } from '../types';

const USERS_KEY = 'culture_closet_users';
const SESSION_KEY = 'culture_closet_session';

export const userService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  signUp: (name: string, email: string, password: string): User | null => {
    const users = userService.getUsers();
    if (users.find(u => u.email === email)) return null;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      wishlist: [],
      orders: []
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    userService.login(email, password);
    return newUser;
  },

  login: (email: string, password: string): User | null => {
    const users = userService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      return safeUser as User;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    
    // Refresh user data from master list to get latest wishlist/orders
    const sessionUser = JSON.parse(data);
    const users = userService.getUsers();
    const latestUser = users.find(u => u.id === sessionUser.id);
    return latestUser || null;
  },

  updateUser: (updatedUser: User) => {
    const users = userService.getUsers();
    const newUsers = users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
    
    // Update session too
    const { password: _, ...safeUser } = updatedUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  },

  toggleWishlist: (productId: string): User | null => {
    const user = userService.getCurrentUser();
    if (!user) return null;

    const wishlist = user.wishlist.includes(productId)
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];

    const updated = { ...user, wishlist };
    userService.updateUser(updated);
    return updated;
  },

  addOrder: (order: Order): User | null => {
    const user = userService.getCurrentUser();
    if (!user) return null;

    const updated = { ...user, orders: [order, ...user.orders] };
    userService.updateUser(updated);
    return updated;
  }
};
