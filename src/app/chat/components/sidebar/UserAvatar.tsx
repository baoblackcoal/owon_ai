'use client';

import { User } from '@/app/chat/types/chat';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from 'lucide-react';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            bg-primary 
            flex 
            items-center 
            justify-center 
            text-primary-foreground 
            font-semibold
            cursor-pointer 
            hover:bg-primary/90 
            transition-colors
          `}
          title={`${user.name} (${user.email})`}
        >
          {getUserInitial(user.name)}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>设置</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 