'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCourses, mockFAQs, mockStudentQuestions, mockExperimentFiles } from '../mockData';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  FileText, 
  BookOpen, 
  Settings, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  MessageSquare, 
  HelpCircle,
  Eye,
  Download,
  BarChart3,
  Users,
  Clock,
  ChevronDown,
  Bell,
  LogOut
} from 'lucide-react';
import { Course, Experiment, FAQItem, StudentQuestion, ExperimentFile } from '../types';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedExperiment, setSelectedExperiment] = useState<string>('all');

  // 统计数据
  const stats = {
    totalCourses: mockCourses.length,
    totalExperiments: mockCourses.reduce((total, course) => total + course.experiments.length, 0),
    totalQuestions: mockStudentQuestions.length,
    totalFAQs: mockFAQs.length,
    totalFiles: mockExperimentFiles.length,
    activeStudents: 3, // 模拟数据
    todayQuestions: mockStudentQuestions.filter(q => 
      new Date(q.timestamp).toDateString() === new Date().toDateString()
    ).length
  };

  // 过滤数据
  const filteredQuestions = mockStudentQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || question.experimentId.includes(selectedCourse);
    const matchesExperiment = selectedExperiment === 'all' || question.experimentId === selectedExperiment;
    
    return matchesSearch && matchesCourse && matchesExperiment;
  });

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || (faq.experimentId && faq.experimentId.includes(selectedCourse));
    
    return matchesSearch && matchesCourse;
  });

  const filteredFiles = mockExperimentFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.experiment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || file.course.includes(selectedCourse);
    
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-800/60">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                管理后台
              </h1>
              <nav className="flex items-center space-x-4 ml-6">
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300">
                  <Users className="h-4 w-4 mr-2" />
                  学生管理
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  数据分析
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300">
                  <Settings className="h-4 w-4 mr-2" />
                  系统设置
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">管理员</span>
                  <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md transition-all">
                概览
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md transition-all">
                实验内容
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md transition-all">
                学生提问
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md transition-all">
                FAQ管理
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md transition-all">
                文件管理
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-3">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="选择课程" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部课程</SelectItem>
                  <SelectItem value="digital">数字电路</SelectItem>
                  <SelectItem value="analog">模拟电路</SelectItem>
                  <SelectItem value="basic">电路基础</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总课程数</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                {/* <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalCourses}</div> */}
                <div className="text-2xl font-bold text-slate-900 dark:text-white">8</div>
                <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      +2 新增
                    </Badge>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-2">较上月</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总实验数</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </CardHeader>
                <CardContent>
                {/* <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalExperiments}</div> */}
                <div className="text-2xl font-bold text-slate-900 dark:text-white">68</div>
                <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      +5 新增
                    </Badge>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-2">较上月</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今日提问</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                {/* <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.todayQuestions}</div> */}
                <div className="text-2xl font-bold text-slate-900 dark:text-white">387</div>
                <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      +12%
                    </Badge>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-2">较昨日</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">活跃学生</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">103</div>
                {/* <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeStudents}</div> */}
                <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      +25%
                    </Badge>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-2">较上周</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">最近提问</CardTitle>
                      <CardDescription>学生最新的问题</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-slate-600 dark:text-slate-300">
                      查看全部
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1">
                      {mockStudentQuestions.slice(0, 5).map((question) => (
                        <div key={question.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-slate-900 dark:text-white">{question.studentName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {question.studentNumber}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {question.experimentName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {new Date(question.timestamp).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{question.question}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">热门问题</CardTitle>
                      <CardDescription>访问量最高的FAQ</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="text-slate-600 dark:text-slate-300">
                      查看全部
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1">
                      {mockFAQs
                        .sort((a, b) => b.viewCount - a.viewCount)
                        .slice(0, 5)
                        .map((faq) => (
                          <div key={faq.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                {faq.category}
                              </Badge>
                              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                                <Eye className="h-3 w-3" />
                                <span>{faq.viewCount}</span>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{faq.question}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{faq.answer}</p>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">实验内容管理</h2>
                <p className="text-slate-500 dark:text-slate-400">管理实验讲义和课程内容</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                上传新讲义
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses.map((course) => (
                <Card key={course.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center
                          ${course.category === 'digital' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                            course.category === 'analog' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 
                            'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-lg text-slate-900 dark:text-white">{course.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className={`
                        ${course.category === 'digital' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 
                          course.category === 'analog' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' : 
                          'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'}`}>
                        {course.category === 'digital' ? '数字' : 
                         course.category === 'analog' ? '模拟' : '基础'}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">实验数量</div>
                          <div className="text-xl font-semibold text-slate-900 dark:text-white">{course.experiments.length}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">总时长</div>
                          <div className="text-xl font-semibold text-slate-900 dark:text-white">
                            {course.experiments.reduce((total, exp) => total + exp.estimatedTime, 0)}h
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {course.experiments.map((experiment) => (
                          <div 
                            key={experiment.id} 
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`h-6 w-6 rounded flex items-center justify-center
                                ${experiment.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 
                                  experiment.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 
                                  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                <FileText className="h-3 w-3" />
                              </div>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{experiment.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={`text-xs
                                ${experiment.difficulty === 'beginner' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 
                                  experiment.difficulty === 'intermediate' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 
                                  'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
                                {experiment.difficulty === 'beginner' ? '初级' : 
                                 experiment.difficulty === 'intermediate' ? '中级' : '高级'}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                              >
                                <Edit className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">学生提问记录</h2>
                <p className="text-muted-foreground">查看和分析学生提问</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="选择课程" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部课程</SelectItem>
                    <SelectItem value="digital">数字电路</SelectItem>
                    <SelectItem value="analog">模拟电路</SelectItem>
                    <SelectItem value="basic">电路基础</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索问题..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="space-y-1">
                    {filteredQuestions.map((question) => (
                      <div key={question.id} className="border-b p-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{question.studentName}</span>
                              <Badge variant="outline" className="text-xs">
                                {question.studentNumber}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {question.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(question.timestamp).toLocaleString()}
                            </span>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {question.experimentName}
                        </p>
                        <p className="text-sm mb-2">{question.question}</p>
                        <div className="text-xs text-muted-foreground">
                          <strong>AI回答:</strong> {question.aiResponse}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Management Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">FAQ管理</h2>
                <p className="text-slate-500 dark:text-slate-400">创建和管理常见问题</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                新建FAQ
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {faq.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          <Eye className="h-3 w-3" />
                          <span>{faq.viewCount}</span>
                        </div>
                        <Badge variant={faq.isPublished ? "default" : "secondary"} className={faq.isPublished ? 
                          "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800" : 
                          "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}>
                          {faq.isPublished ? "已发布" : "草稿"}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-base text-slate-900 dark:text-white line-clamp-2">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                      {faq.answer}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Files Management Tab */}
          <TabsContent value="files" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">文件管理</h2>
                <p className="text-slate-500 dark:text-slate-400">管理实验讲义文件</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
                <Upload className="h-4 w-4 mr-2" />
                上传文件
              </Button>
            </div>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredFiles.map((file) => (
                      <div key={file.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center
                              ${file.fileName.endsWith('.pdf') ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 
                                file.fileName.endsWith('.doc') || file.fileName.endsWith('.docx') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                                'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white mb-1">{file.fileName}</p>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                  {file.course}
                                </Badge>
                                <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{file.experiment}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{file.size}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(file.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Download className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Edit className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 