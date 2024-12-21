import { useContext, useEffect, useState } from "react";

import Username from "./Username";
import { loginUser } from "../lib/api";
import RequestError from "./RequestError";
import { UserContext } from "../contexts/user-context";
import { login } from "../lib/auth";

function LoginForm() {
  const [username, setUsername] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { setLoggedInUser } = useContext(UserContext);

  useEffect(() => {
    async function submit() {
      if (username === null) {
        return;
      }

      try {
        setError(null);
        const loggedInUser = await loginUser({ username });
        login(loggedInUser);
        setLoggedInUser(loggedInUser);
        setUsername(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setSubmitting(false);
      }
    }

    if (submitting) {
      submit();
    }
  }, [submitting, username, setLoggedInUser]);

  return (
    <>
      <p className="lead">Login</p>
      <form>
        <Username onValidUsername={setUsername} />

        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => setSubmitting(true)}
          disabled={username === null || submitting}
        >
          Login
        </button>
      </form>
      {error && <RequestError error={error} />}
    </>
  );
}

export default LoginForm;
