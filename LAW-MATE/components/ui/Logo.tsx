import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  // The repository now ships with an SVG logo in public/.
  // You can replace it later with your official mark (PNG/WEBP/etc). If the
  // image fails to load we fall back to a text title.
  const [errored, setErrored] = React.useState(false);

  if (errored) {
    return (
      <span className={`${className} font-bold text-primary`}>LawMate</span>
    );
  }

  return (
    <img
      src="/lawmate-logo.svg"
      alt="LawMate Logo"
      className={`${className} transition-transform duration-500 hover:scale-110`}
      onError={() => setErrored(true)}
    />
  );
};