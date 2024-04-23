import { ReactNode } from "react";

interface PlaceholderWrapperProps {
  lines?: number;
  children?: ReactNode;
}

export const PlaceholderWrapper = ({ lines, children }: PlaceholderWrapperProps) => {
  return children ? (
    children
  ) : (
    <div className="animate-pulse">
      {[...Array(lines || 3)].map((_, i) => (
        <div className="my-4 h-2 bg-slate-200 rounded " key={i}></div>
      ))}
    </div>
  );
};
