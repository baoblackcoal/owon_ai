'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Clock, Users, Zap, ArrowRight, User, LogOut } from 'lucide-react';
import { mockCourses } from './mockData';
import { Student, Course, Experiment } from './types';

export default function DblyMainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const router = useRouter();

  // 检查登录状态
  useEffect(() => {
    const studentInfo = localStorage.getItem('dbly1-student');
    if (!studentInfo) {
      router.push('/test/dbly1/login');
      return;
    }
    
    try {
      const parsedStudent = JSON.parse(studentInfo);
      setStudent({
        ...parsedStudent,
        loginTime: new Date(parsedStudent.loginTime)
      });
    } catch (error) {
      console.error('Failed to parse student info:', error);
      router.push('/test/dbly1/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dbly1-student');
    router.push('/test/dbly1/login');
  };

  const filteredCourses = mockCourses.filter((course: Course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'digital': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      case 'analog': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      case 'basic': return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'digital': return '数字电路';
      case 'analog': return '模拟电路';
      case 'basic': return '电路基础';
      default: return '其他';
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">正在加载...</p>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return <CourseDetailPage course={selectedCourse} onBack={() => setSelectedCourse(null)} student={student} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with User Info */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              AI实验教学辅助系统
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              基于OWON FDS四合一仪器的智能实验教学平台
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">欢迎您</p>
              <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">学号: {student.studentNumber}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800">
              <LogOut className="h-4 w-4 mr-2" />
              退出
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索课程..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course) => (
            <Card key={course.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:scale-105 hover:bg-white dark:hover:bg-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={getCategoryColor(course.category) + " border"}>
                    {getCategoryName(course.category)}
                  </Badge>
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <CardTitle className="text-xl text-slate-900 dark:text-white">{course.name}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.experiments.length} 个实验
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.experiments.reduce((total: number, exp: Experiment) => total + exp.estimatedTime, 0)} 小时
                  </div>
                </div>
                <Button 
                  onClick={() => setSelectedCourse(course)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                >
                  查看实验
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">未找到匹配的课程</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseDetailPage({ course, onBack, student }: { course: Course; onBack: () => void; student: Student }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'digital': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      case 'analog': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      case 'basic': return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'digital': return '数字电路';
      case 'analog': return '模拟电路';
      case 'basic': return '电路基础';
      default: return '其他';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={onBack} variant="outline" className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800">
          ← 返回课程列表
        </Button>
        
        <div className="mb-8">
          <Badge className={getCategoryColor(course.category) + " mb-2 border"}>
            {getCategoryName(course.category)}
          </Badge>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {course.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {course.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.experiments.map((experiment) => (
            <Card key={experiment.id} className="hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:scale-105 hover:bg-white dark:hover:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 dark:text-white">{experiment.name}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">{experiment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">难度等级:</span>
                    <Badge variant={experiment.difficulty === 'beginner' ? 'default' : 
                                   experiment.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                           className={experiment.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                     experiment.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                     'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                      {experiment.difficulty === 'beginner' ? '初级' : 
                       experiment.difficulty === 'intermediate' ? '中级' : '高级'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">预计时间:</span>
                    <span className="text-slate-900 dark:text-white">{experiment.estimatedTime} 小时</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-600 dark:text-slate-400">实验设备:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {experiment.equipment.map((item: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                    onClick={() => window.location.href = `/test/dbly1/experiment/${experiment.id}`}
                  >
                    开始实验
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 