import { createContext } from "react";
import { LoggedInUser } from "../lib/api";

interface UserContextProps {
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: (user: LoggedInUser | null) => void;
}

export const UserContext = createContext<UserContextProps>({
  loggedInUser: null,
  setLoggedInUser: () => {},
});
