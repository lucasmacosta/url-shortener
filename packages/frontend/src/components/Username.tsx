import { useEffect, useState } from "react";

interface UsernameProps {
  onValidUsername: (username: string | null) => void;
}

function isValidUsername(username: string) {
  return /^[a-z][a-z]{0,49}$/.test(username);
}

function Username({ onValidUsername }: UsernameProps) {
  const [username, setUsername] = useState("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const isValid = isValidUsername(username);
    setValid(isValid);
    onValidUsername(isValid ? username : null);
  }, [username, onValidUsername]);

  return (
    <>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          className="form-control my-2"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
        />
        {username && !valid && (
          <p className="text-danger mt-1">Enter a valid username</p>
        )}
      </div>
    </>
  );
}

export default Username;
