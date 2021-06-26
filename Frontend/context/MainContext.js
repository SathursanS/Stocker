import React, { createContext, useState } from 'react';

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [updateNews, setUpdateNews] = useState(false);

  return (
    <MainContext.Provider
      value={{
        updateNews,
        setUpdateNews,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
