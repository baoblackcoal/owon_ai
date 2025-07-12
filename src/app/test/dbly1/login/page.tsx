'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, GraduationCap, Zap, AlertCircle } from 'lucide-react';

export default function StudentLoginPage() {
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 基本验证
    if (!name.trim()) {
      setError('请输入姓名');
      setIsLoading(false);
      return;
    }

    if (!studentNumber.trim()) {
      setError('请输入学号');
      setIsLoading(false);
      return;
    }

    // 学号格式验证（简单验证）
    if (!/^\d{7}$/.test(studentNumber)) {
      setError('学号格式不正确，请输入7位数字');
      setIsLoading(false);
      return;
    }

    try {
      // 模拟登录过程
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 保存学生信息到localStorage
      const studentInfo = {
        id: `student-${Date.now()}`,
        name: name.trim(),
        studentNumber: studentNumber.trim(),
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('dbly1-student', JSON.stringify(studentInfo));
      
      // 跳转到主页面
      router.push('/test/dbly1');
    } catch (err) {
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            AI实验教学辅助系统
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            基于OWON FDS四合一仪器的智能实验教学平台
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-slate-900 dark:text-white">学生登录</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              请输入您的姓名和学号进入系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">姓名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="请输入您的姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentNumber" className="text-slate-700 dark:text-slate-300">学号</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="studentNumber"
                    type="text"
                    placeholder="请输入7位学号"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    className="pl-10 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                    disabled={isLoading}
                    maxLength={7}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '进入系统'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
            演示账号信息
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <p>• 姓名：张三 / 李四 / 王五</p>
            <p>• 学号：2021001 / 2021002 / 2021003</p>
            <p>• 支持任意7位数字学号</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2024 AI实验教学辅助系统</p>
          <p>基于OWON FDS四合一仪器</p>
        </div>
      </div>
    </div>
  );
} 