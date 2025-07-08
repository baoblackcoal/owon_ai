'use client';

import { User } from '@/app/chat/types/chat';

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
  );
} 