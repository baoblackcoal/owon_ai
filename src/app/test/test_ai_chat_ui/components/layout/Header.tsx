import { User } from '../../types/chat';
import { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  user?: User;
  children?: ReactNode;
  title?: string;
  lastMessageTime?: string;
}

export function Header({ user, children, title, lastMessageTime }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-[60px] border-b bg-card flex items-center justify-between px-4" id="ai_chat_header">
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
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
          <span className="text-muted-foreground">
            {user?.name?.[0] || '用户'}
          </span>
        </div>
      </div>
    </header>
  );
} 