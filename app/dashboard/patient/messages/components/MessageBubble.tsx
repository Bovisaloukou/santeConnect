import { Message } from '../types';
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "mb-4 flex",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3",
          isOwnMessage
            ? "bg-emerald-500 text-white"
            : "bg-white border"
        )}
      >
        <p>{message.content}</p>
        <p
          className={cn(
            "text-xs mt-1",
            isOwnMessage ? "text-emerald-100" : "text-gray-500"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
} 