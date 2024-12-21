import { useContext, useEffect, useState } from "react";

import UrlForm from "./UrlForm";
import UserManagement from "./UserManagement";
import { UserContext } from "../contexts/user-context";
import UserUrls from "./UserUrls";
import { getLoggedInUser } from "../lib/auth";
import { UrlMapping } from "../lib/api";

function Main() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [urlMappings, setUrlMappings] = useState<UrlMapping[]>([]);
  const [urlMapping, setUrlMapping] = useState<UrlMapping | null>(null);

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    setLoggedInUser(loggedInUser);
  }, [setLoggedInUser]);

  useEffect(() => {
    setUrlMappings([]);
  }, [loggedInUser]);

  function onSaveChanges(urlMapping: UrlMapping) {
    const idx = urlMappings.findIndex(({ id }) => urlMapping.id === id);
    const updatedUrlMappings = [...urlMappings];
    if (idx === -1) {
      updatedUrlMappings.push(urlMapping);
    } else {
      updatedUrlMappings[idx] = urlMapping;
    }
    setUrlMappings(updatedUrlMappings);
    setUrlMapping(null);
  }

  function onCancelEdit() {
    setUrlMapping(null);
  }

  return (
    <>
      <div className="container-fluid py-4 px-3 mx-auto">
        <h1>
          URL Shortener <i className="bi-link-45deg"></i>
        </h1>
        <div className="row">
          <div className="col-sm-6">
            <UrlForm
              urlMapping={urlMapping}
              onSaveChanges={onSaveChanges}
              onCancelEdit={onCancelEdit}
            />
          </div>
          <div className="col-sm-3">
            {!loggedInUser && <UserManagement />}
            {loggedInUser && (
              <UserUrls
                urlMappings={urlMappings}
                setUrlMappings={setUrlMappings}
                onEditUrlMapping={setUrlMapping}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
