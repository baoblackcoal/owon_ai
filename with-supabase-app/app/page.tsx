import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Clock, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* 英雄区 */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-background to-muted">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          高效管理你的每日任务
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl">
          OWON Todo 帮助你轻松管理任务、提高工作效率、实现目标。简单易用，功能强大，让你的工作生活更有条理。
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/auth/sign-up">
              立即开始
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/login">
              登录账号
            </Link>
          </Button>
        </div>
      </section>

      {/* 功能展示区 */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            为什么选择 OWON Todo？
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">简单直观</h3>
              <p className="text-muted-foreground">
                清晰的界面设计，直观的操作方式，让你快速上手，轻松管理任务。
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
              <Clock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">高效管理</h3>
              <p className="text-muted-foreground">
                强大的任务管理功能，帮助你合理安排时间，提高工作效率。
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
              <Share2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">随时访问</h3>
              <p className="text-muted-foreground">
                云端存储，多设备同步，让你随时随地都能查看和管理你的任务。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 行动区 */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            准备好提升你的工作效率了吗？
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            立即注册，开始使用 OWON Todo，让你的每一天都更有计划。
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/auth/sign-up">
              免费注册
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
