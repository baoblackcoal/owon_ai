'use client';

import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { UserAvatar } from '../sidebar/UserAvatar';
import { User } from '../../types/chat';

interface HeaderAuthProps {
  user: User;
  isAuthenticated: boolean;
}

export function HeaderAuth({ user, isAuthenticated }: HeaderAuthProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Button asChild size="sm" variant="default">
          <Link href="/auth/login">登录</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/sign-up">注册</Link>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 text-sm">
            未登录每天可以免费使用20次
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="text-right text-sm">
        <div className="font-medium">{user.name}</div>
        <div className="text-muted-foreground text-xs">{user.email}</div>
      </div>
      <UserAvatar user={user} size="sm" />
    </div>
  );
} 