'use client';

import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AuthButtonsProps {
  isExpanded: boolean;
}

export function AuthButtons({ isExpanded }: AuthButtonsProps) {
  if (!isExpanded) {
    return (
      <div className="flex flex-col items-center space-y-2 p-2">
        <Button asChild size="sm" variant="default" className="w-full">
          <Link href="/auth/login">登</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href="/auth/sign-up">注</Link>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full p-1"
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
    <div className="p-2 space-y-2">
      <div className="flex space-x-2">
        <Button asChild size="sm" variant="default" className="flex-1">
          <Link href="/auth/login">登录</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1">
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
    </div>
  );
} 