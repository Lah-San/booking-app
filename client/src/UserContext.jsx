import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    try{
      if (!user) {
        axios.get("/profile").then(({ data }) => {
          setUser(data);
          setReady(true);
        });
      }
    }catch(e){
      if (e.code === 'ECONNABORTED' || e.code === 'ECONNREFUSED') {
        setError("Server not responding, please try again later.");
      } else if (e.message === 'Network Error') {
        setError("No network connection")
      } else if (e.response.status === 401) {
        setError("You are not authorized");
      } else if (e.response.status === 500) {
        setError("Server Error, please try again later");
      } else {
        setError("An error occurred, please try again later");
      }
    }

  }, []);

  return (

    <UserContext.Provider value={{ user, setUser, ready, error }}>
      {children}
    </UserContext.Provider>
  );
}
