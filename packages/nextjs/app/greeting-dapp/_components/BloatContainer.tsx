import { ReactNode } from "react";
import { PlaceholderWrapper } from "./PlaceholderWrapper";

interface BloatContainerProps {
  title?: string;
  children?: ReactNode;
}

export const BloatContainer = ({ title, children }: BloatContainerProps) => {
  return (
    <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300  flex flex-col mt-10 relative">
      {title ? (
        <div className="h-[5rem] w-auto px-6 bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
          <div className="flex items-center justify-center space-x-2">
            <p className="my-0 text-sm">{title}</p>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="p-5 divide-y divide-base-300">
        <PlaceholderWrapper>{children}</PlaceholderWrapper>
      </div>
    </div>
  );
};
