import React, { createContext, useState, useContext } from "react";

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Make an exportable function for it
const useDarkMode = () => {
  const darkMode = useContext(DarkModeContext);
  return darkMode;
};

export { DarkModeProvider, useDarkMode };
