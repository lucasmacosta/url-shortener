import { LoggedInUser } from "./api";

const LOCAL_STORAGE_LOGGED_IN_USER_KEY = "url-shortener-logged-in-user";

export function login(loggedInUser: LoggedInUser) {
  localStorage.setItem(
    LOCAL_STORAGE_LOGGED_IN_USER_KEY,
    JSON.stringify(loggedInUser)
  );
}

export function logout() {
  localStorage.removeItem(LOCAL_STORAGE_LOGGED_IN_USER_KEY);
}

export function getLoggedInUser() {
  const loggedInUserStr = localStorage.getItem(
    LOCAL_STORAGE_LOGGED_IN_USER_KEY
  );

  if (loggedInUserStr === null) {
    return null;
  }

  return JSON.parse(loggedInUserStr) as LoggedInUser;
}
