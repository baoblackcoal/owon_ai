import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/logout-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ListTodo, Home } from 'lucide-react';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 导航栏 */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/protected" className="font-semibold">
              OWON Todo
            </Link>
            <nav className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/protected" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  首页
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/protected/todos" className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4" />
                  任务
                </Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  );
}
