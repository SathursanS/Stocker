import React, { createContext, useState } from 'react';

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [updateNews, setUpdateNews] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);

  const updateNewsFunction = () => {
    setUpdateNews(!updateNews);
  };

  const updateProfileFunction = () => {
    setUpdateProfile(!updateProfile);
  };

  return (
    <MainContext.Provider
      value={{
        updateNews,
        updateNewsFunction,
        updateProfile,
        updateProfileFunction,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
