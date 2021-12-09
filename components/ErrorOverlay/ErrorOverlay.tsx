import React, { FC } from "react";

const ErrorOverlay: FC<{
  header: string;
  paragraphs: string[];
  show: boolean;
}> = ({ header, paragraphs, show }) => {
  return show ? (
    <>
      <div className="absolute inset-0 bg-white backdrop-blur-sm z-10 bg-opacity-90"></div>
      <div className="absolute inset-0 z-20 flex flex-col items-center">
        <h2 className="mb-2">{header}</h2>
        {paragraphs.map((content, i) => (
          <p key={i} className="max-w-sm w-full mb-2 last:mb-0">
            {content}
          </p>
        ))}
      </div>
    </>
  ) : null;
};

export default ErrorOverlay;
