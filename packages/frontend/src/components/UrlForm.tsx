import { useContext, useEffect, useState } from "react";
import { isWebUri } from "valid-url";

import { apiBaseUrl, createUrl, updateUrl, UrlMapping } from "../lib/api";
import RequestError from "./RequestError";
import { UserContext } from "../contexts/user-context";
import ShortenedUrl from "./ShortenedUrl";

interface UrlFormProps {
  urlMapping: UrlMapping | null;
  onSaveChanges: (urlMapping: UrlMapping) => void;
  onCancelEdit: () => void;
}

function isValidSlug(slug: string, allowEmpty: boolean) {
  return (slug === "" && allowEmpty) || /^[a-zA-Z0-9]{6}$/.test(slug);
}

function UrlForm(props: UrlFormProps) {
  const { urlMapping, onSaveChanges, onCancelEdit } = props;
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [urlMappingPreview, setUrlMappingPreview] = useState<UrlMapping | null>(
    null
  );
  const [validUrl, setValidUrl] = useState(false);
  const [slug, setSlug] = useState("");
  const [validSlug, setValidSlug] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  const isEdit = urlMapping !== null;

  useEffect(() => {
    async function submit() {
      try {
        setError(null);
        const token = loggedInUser?.token;
        let urlMappingRes: UrlMapping;

        if (!isEdit) {
          urlMappingRes = await createUrl(
            { url, slug: slug || undefined },
            token
          );
        } else {
          urlMappingRes = await updateUrl(urlMapping.slug, { slug }, token);
        }
        onSaveChanges(urlMappingRes);
        setUrlMappingPreview(urlMappingRes);
        setSlug("");
      } catch (err) {
        setError(err as Error);
      } finally {
        setSubmitting(false);
      }
    }

    if (submitting) {
      submit();
    }
  }, [submitting, url, slug, loggedInUser, urlMapping, onSaveChanges, isEdit]);

  useEffect(() => {
    if (isEdit) {
      setUrl(urlMapping.url);
      setSlug(urlMapping.slug);
    }
  }, [urlMapping, isEdit]);

  useEffect(() => {
    setValidUrl(isWebUri(url) !== undefined);
    setUrlMappingPreview(null);
    setError(null);
  }, [url]);

  useEffect(() => {
    setValidSlug(isValidSlug(slug, !isEdit));
    setError(null);
  }, [slug, isEdit]);

  return (
    <>
      <p className="lead">Enter the URL to shorten</p>
      <form>
        <div className="form-group">
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            className="form-control my-2"
            name="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isEdit}
          />
          {url && !validUrl && (
            <p className="text-danger mt-1">Enter a valid URL</p>
          )}
        </div>
        {loggedInUser && (
          <div className="form-group mt-4 mb-3">
            <div className="input-group w-50">
              <span className="input-group-text" id="basic-addon1">
                {apiBaseUrl}/
              </span>
              <input
                type="text"
                className="form-control w-50"
                placeholder="slug"
                aria-label="slug"
                aria-describedby="basic-addon1"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            {slug && !validSlug && (
              <p className="text-danger mt-1">Enter a valid slug</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => setSubmitting(true)}
          disabled={!(validUrl && validSlug) || submitting}
        >
          {!isEdit ? "Shorten" : "Update"}
        </button>
        {isEdit && (
          <button
            type="submit"
            className="btn btn-danger"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
        {error && <RequestError error={error} />}
      </form>
      {urlMappingPreview && <ShortenedUrl urlMapping={urlMappingPreview} />}
    </>
  );
}

export default UrlForm;
