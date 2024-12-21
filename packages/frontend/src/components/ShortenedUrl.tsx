import { useEffect, useState } from "react";

import { buildShortUrl, UrlMapping } from "../lib/api";

async function copyToClipboard(str: string) {
  await navigator.clipboard.writeText(str);
}

function ShortenedUrl(attrs: { urlMapping: UrlMapping }) {
  const { urlMapping } = attrs;

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copied]);

  function copy() {
    copyToClipboard(buildShortUrl(urlMapping));
    setCopied(true);
  }

  return (
    <>
      <p className="text-success mt-4">
        <strong>Success! Here's your short URL:</strong>
      </p>
      <a href={buildShortUrl(urlMapping)} target="_blank">
        {buildShortUrl(urlMapping)}
      </a>
      <button
        type="button"
        className="btn btn-outline-primary ms-4"
        onClick={() => copy()}
      >
        Copy <i className="bi-copy"></i>
      </button>
      {copied && <span className="text-primary ms-2">Copied!</span>}
    </>
  );
}

export default ShortenedUrl;
