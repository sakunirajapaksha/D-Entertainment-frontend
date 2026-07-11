export const getUserInfo = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const userInfo = localStorage.getItem("userInfo");

  return userInfo ? JSON.parse(userInfo) : null;
};

export const getToken = () => {
  const user = getUserInfo();
  return user?.token || null;
};

export const logout = () => {
  localStorage.removeItem("userInfo");
};