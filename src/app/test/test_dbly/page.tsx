'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCourses, Course } from './mockData';
import { Search, BookOpen, Clock, Users, Settings } from 'lucide-react';

export default function TestDblyMainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = mockCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'digital': return 'bg-blue-100 text-blue-800';
      case 'analog': return 'bg-green-100 text-green-800';
      case 'basic': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (selectedCourse) {
    return <CourseDetailPage course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI实验教学辅助系统</h1>
            <p className="text-gray-600 mt-2">智能化实验预习与问答辅导平台</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                window.location.href = '/test/test_dbly/admin';
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              管理后台
            </Button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索实验课程..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">总课程数</p>
                <p className="text-2xl font-bold">{mockCourses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">总实验数</p>
                <p className="text-2xl font-bold">
                  {mockCourses.reduce((sum, course) => sum + course.experiments.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">AI导师</p>
                <p className="text-2xl font-bold">在线</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 课程列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <Badge className={getCategoryColor(course.category)}>
                  {getCategoryName(course.category)}
                </Badge>
              </div>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {course.experiments.length} 个实验
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  预计 {course.experiments.reduce((sum, exp) => sum + exp.estimatedTime, 0)} 分钟
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => setSelectedCourse(course)}
                >
                  进入课程
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">没有找到匹配的课程</p>
        </div>
      )}
    </div>
  );
}

// 课程详情页面组件
function CourseDetailPage({ course, onBack }: { course: Course; onBack: () => void }) {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* 返回按钮和课程标题 */}
      <div className="mb-8">
        <Button variant="outline" onClick={onBack} className="mb-4">
          ← 返回课程列表
        </Button>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
          <Badge className={getCategoryColor(course.category)}>
            {getCategoryName(course.category)}
          </Badge>
        </div>
        <p className="text-gray-600">{course.description}</p>
      </div>

      {/* 实验列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {course.experiments.map((experiment) => (
          <Card key={experiment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{experiment.name}</CardTitle>
                <Badge variant={
                  experiment.difficulty === 'beginner' ? 'default' :
                  experiment.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                }>
                  {experiment.difficulty === 'beginner' ? '入门' :
                   experiment.difficulty === 'intermediate' ? '中级' : '高级'}
                </Badge>
              </div>
              <CardDescription>{experiment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  预计时间：{experiment.estimatedTime} 分钟
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">所需器材：</p>
                  <div className="flex flex-wrap gap-1">
                    {experiment.equipment.slice(0, 3).map((eq, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {eq}
                      </Badge>
                    ))}
                    {experiment.equipment.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{experiment.equipment.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      // 跳转到预习页面
                      window.location.href = `/test/test_dbly/preview/${experiment.id}`;
                    }}
                  >
                    开始预习
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      // 跳转到实验页面
                      window.location.href = `/test/test_dbly/experiment/${experiment.id}`;
                    }}
                  >
                    进入实验
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  function getCategoryColor(category: string) {
    switch (category) {
      case 'digital': return 'bg-blue-100 text-blue-800';
      case 'analog': return 'bg-green-100 text-green-800';
      case 'basic': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getCategoryName(category: string) {
    switch (category) {
      case 'digital': return '数字电路';
      case 'analog': return '模拟电路';
      case 'basic': return '电路基础';
      default: return '其他';
    }
  }
} 