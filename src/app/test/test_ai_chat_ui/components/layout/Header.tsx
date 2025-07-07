import { User } from '../../types/chat';
import { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  user?: User;
  children?: ReactNode;
}

export function Header({ user, children }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-[60px] border-b bg-card flex items-center justify-between px-4">
      <div className="flex items-center">
        {children}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">O</span>
          </div>
          <span className="text-lg font-bold">OWON AI 助手</span>
        </div>
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