import { useContext, useEffect, useState } from "react";
import { UrlMapping, buildShortUrl, getUrls } from "../lib/api";
import { UserContext } from "../contexts/user-context";
import { logout } from "../lib/auth";
import RequestError from "./RequestError";

interface UserUrlsProps {
  urlMappings: UrlMapping[];
  setUrlMappings: (urlMappings: UrlMapping[]) => void;
  onEditUrlMapping: (urlMapping: UrlMapping) => void;
}

function UserUrls(props: UserUrlsProps) {
  const { urlMappings, setUrlMappings, onEditUrlMapping } = props;

  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUrlMappings() {
      try {
        setError(null);
        const urlMappings = await getUrls(loggedInUser?.token as string);
        setUrlMappings(urlMappings);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchUrlMappings();
  }, [loading, loggedInUser, setUrlMappings]);

  function doLogout() {
    logout();
    setLoggedInUser(null);
  }

  return (
    <>
      <p className="lead">Your urls</p>

      {urlMappings.length === 0 && (
        <p className="text-info mt-1">No urls created yet</p>
      )}

      <ul className="list-group">
        {urlMappings.map((urlMapping) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-start"
            id={urlMapping.slug}
          >
            <div className="me-auto text-truncate">
              <div className="fw-bold">
                <a
                  style={{ display: "block" }}
                  href={buildShortUrl(urlMapping)}
                >
                  {buildShortUrl(urlMapping)}
                </a>
              </div>
              {urlMapping.url}
            </div>
            <button
              className="btn btn-info mt-2"
              type="button"
              onClick={() => onEditUrlMapping(urlMapping)}
            >
              Edit <i className="bi-edit"></i>
            </button>
          </li>
        ))}
      </ul>

      {error && <RequestError error={error} />}

      <button
        className="btn btn-secondary mt-2"
        type="button"
        onClick={doLogout}
      >
        Logout
      </button>
    </>
  );
}

export default UserUrls;
