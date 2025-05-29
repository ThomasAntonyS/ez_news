import { createContext, useState } from "react";

export const newsContext = createContext();

const NewsContext = ({ children }) => {
  const [popular, setPopular] = useState([]);


  return (
    <newsContext.Provider value={{ popular, setPopular }}>
      {children}
    </newsContext.Provider>
  );
};

export default NewsContext