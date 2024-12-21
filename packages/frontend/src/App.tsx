import { useState } from "react";

import { UserContext } from "./contexts/user-context";
import { LoggedInUser } from "./lib/api";
import Main from "./components/Main";
import "./App.scss";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Main />
      <script type="module" src="./js/main.js"></script>
    </UserContext.Provider>
  );
}

export default App;
