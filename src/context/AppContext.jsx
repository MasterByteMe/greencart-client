// Create the AppContext and a helper hook to access it

import { createContext, useContext } from "react";

// 1️⃣ Create a new context object that will hold your global state
export const AppContext = createContext();

// 2️⃣ Custom hook for using the context easily inside components
export const useAppContext = () => {
    return useContext(AppContext);
};
