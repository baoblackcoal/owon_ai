import { User } from '../../types/chat';
import { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../../hooks/useTheme';
import { HeaderAuth } from './HeaderAuth';

interface HeaderProps {
  user?: User;
  isAuthenticated?: boolean;
  children?: ReactNode;
  title?: string;
  lastMessageTime?: string;
}

export function Header({ user, isAuthenticated = false, children, title, lastMessageTime }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-[60px] border-b flex items-center justify-between px-4" id="ai_chat_header">
      <div className="flex items-center space-x-4">
        {children}
        {title && (
          <div id="ai_chat_title">
            <h2 className="text-lg font-medium">{title}</h2>
            {lastMessageTime && (
              <p className="text-sm text-muted-foreground">
                {new Date(lastMessageTime).toLocaleString()} · 可继续对话
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* TODO: 主题切换 */}
        {/* <ThemeToggle theme={theme} onToggle={toggleTheme} /> */}
        
        {user && (
          <HeaderAuth user={user} isAuthenticated={isAuthenticated} />
        )}
      </div>
    </header>
  );
} 