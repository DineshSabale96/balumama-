import { useState } from 'react';

// Shows a site photo. If the file is missing, shows a styled placeholder with the label.
export default function Photo({ src, alt, label }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="photo-fallback" role="img" aria-label={alt}>
        <span>{label}</span>
      </div>
    );
  }
  return <img className="photo" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
