'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const defaultUser = {
  id: null,
  nickname: '',
  role: 'teen',
  avatar: '🌱',
  karmaPoints: 0,
  teensHelped: 0,
  journalStreak: 0,
  badges: [],
  isLoggedIn: false,
};

const UserContext = createContext({
  user: defaultUser,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  addKarma: () => {},
});


export function UserProvider({ children }) {
  const [user, setUser] = useState(defaultUser);

  useEffect(() => {
    const saved = localStorage.getItem('safespace-user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const login = (userData) => {
    const u = { ...defaultUser, ...userData, isLoggedIn: true, id: Date.now().toString() };
    setUser(u);
    localStorage.setItem('safespace-user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(defaultUser);
    localStorage.removeItem('safespace-user');
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('safespace-user', JSON.stringify(next));
      return next;
    });
  };

  const addKarma = (points) => {
    updateUser({ karmaPoints: (user.karmaPoints || 0) + points });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, addKarma }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
