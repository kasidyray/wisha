import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Gift, 
  ChevronDown,
  LayoutDashboard,
  PlusCircle
} from "lucide-react"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Dropdown Menu
const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

// User Avatar with Dropdown
interface UserAvatarProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  className?: string;
}

const UserAvatar = ({ user, className }: UserAvatarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Ensure name starts with capital letter
  const formattedName = user.name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-2 rounded-full border bg-white px-2 py-1 hover:shadow-sm transition-all duration-200">
          <Avatar className={className}>
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={formattedName} />
            ) : (
              <AvatarFallback className="bg-[#FF385C]/10 text-[#FF385C] font-medium">
                {formattedName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-xl p-2" align="end">
        <div className="px-2 py-1.5 mb-1">
          <p className="font-medium text-sm">{formattedName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-[#FF385C]/10 rounded-lg py-2 px-2 my-1 gap-2"
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard className="h-4 w-4 text-gray-500" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-[#FF385C]/10 rounded-lg py-2 px-2 my-1 gap-2"
          onClick={() => navigate('/create-event')}
        >
          <PlusCircle className="h-4 w-4 text-gray-500" />
          <span>Create Event</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-[#FF385C]/10 rounded-lg py-2 px-2 my-1 gap-2 text-red-500"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { 
  Avatar, 
  AvatarImage, 
  AvatarFallback, 
  UserAvatar 
}
