import React, { FC, ReactNode } from "react";

const ErrorOverlay: FC<{
  header: string;
  paragraphs: string[];
  show: boolean;
  footer?: ReactNode;
}> = ({ header, paragraphs, show, footer }) => {
  return show ? (
    <>
      <div className="absolute inset-0 bg-white backdrop-blur-sm z-10 bg-opacity-90"></div>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <h2 className="mb-4">{header}</h2>
        {paragraphs.map((content, i) => (
          <p key={i} className="max-w-sm w-full mb-2 text-sm last:mb-0">
            {content}
          </p>
        ))}
        {footer}
      </div>
    </>
  ) : null;
};

export default ErrorOverlay;
