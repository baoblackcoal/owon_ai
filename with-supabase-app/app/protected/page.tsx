import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ListTodo, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">
          欢迎回来，{user?.email}
        </h1>
        <p className="text-muted-foreground mb-6">
          这是你的个人工作空间，你可以在这里管理你的所有任务。
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/protected/todos" className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              查看所有任务
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/protected/todos" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              创建新任务
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">最近的任务</h2>
        {todos && todos.length > 0 ? (
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-card"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    todo.completed ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                />
                <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                  {todo.title}
                </span>
              </div>
            ))}
            <div className="mt-4">
              <Button asChild variant="link" className="gap-2">
                <Link href="/protected/todos">
                  查看更多
                  <ListTodo className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-card rounded-lg">
            <p className="text-muted-foreground">
              暂无任务，开始创建你的第一个任务吧！
            </p>
            <Button asChild variant="link" className="mt-4">
              <Link href="/protected/todos">创建任务</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
