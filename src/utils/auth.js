export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const getUser = () => {
  const u = localStorage.getItem('user');
  try { return u ? JSON.parse(u) : null; } catch { return null; }
};
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('user');

export const logout = () => {
  removeToken();
  removeUser();
};
