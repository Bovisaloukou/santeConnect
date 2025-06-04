import { Contact } from '../types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}

export function ContactItem({ contact, isSelected, onClick }: ContactItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
        isSelected && "bg-gray-100"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-emerald-100 text-emerald-600">
            {contact.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium truncate">{contact.name}</h3>
            {contact.lastMessageTime && (
              <span className="text-xs text-gray-500">
                {contact.lastMessageTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 truncate">{contact.role}</p>
          
          {contact.lastMessage && (
            <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
          )}
        </div>

        {contact.unreadCount > 0 && (
          <Badge variant="default" className="bg-emerald-500">
            {contact.unreadCount}
          </Badge>
        )}
      </div>
    </div>
  );
} 