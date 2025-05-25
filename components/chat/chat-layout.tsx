import { ReactNode } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
} 