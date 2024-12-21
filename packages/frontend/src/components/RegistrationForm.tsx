import { useEffect, useState } from "react";

import Username from "./Username";
import { createUser } from "../lib/api";
import RequestError from "./RequestError";

interface RegistrationFormProps {
  onUserCreated: () => void;
}

function RegistrationForm({ onUserCreated }: RegistrationFormProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function submit() {
      if (username === null) {
        return;
      }

      try {
        setError(null);
        await createUser({ username });
        onUserCreated();
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
  }, [submitting, username, onUserCreated]);

  return (
    <>
      <p className="lead">Register as new user</p>
      <form>
        <Username onValidUsername={setUsername} />

        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => setSubmitting(true)}
          disabled={username === null || submitting}
        >
          Register
        </button>
      </form>
      {error && <RequestError error={error} />}
    </>
  );
}

export default RegistrationForm;
