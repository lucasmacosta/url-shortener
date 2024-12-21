import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import React from "react";
import LoginForm from "./LoginForm";

function UserManagement() {
  const [login, setLogin] = useState(true);
  const [userCreated, setUserCreated] = useState(false);

  function onUserCreated() {
    setUserCreated(true);
    setLogin(true);
  }

  function register() {
    setUserCreated(false);
    setLogin(false);
  }

  return (
    <>
      {userCreated && (
        <p className="text-success mt-4">
          <strong>Your user was created, you can login now</strong>
        </p>
      )}

      {!login && (
        <React.Fragment>
          <RegistrationForm onUserCreated={onUserCreated} />
          <button
            className="btn btn-success mt-2"
            type="button"
            onClick={() => setLogin(true)}
          >
            Login
          </button>
        </React.Fragment>
      )}

      {login && (
        <React.Fragment>
          <LoginForm />
          <button
            className="btn btn-success mt-2"
            type="button"
            onClick={register}
          >
            Register
          </button>
        </React.Fragment>
      )}
    </>
  );
}

export default UserManagement;
