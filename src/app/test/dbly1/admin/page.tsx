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
  Clock
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI实验教学辅助系统</h1>
              <p className="text-muted-foreground">管理后台</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                <Settings className="h-3 w-3 mr-1" />
                管理员
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="content">实验内容</TabsTrigger>
            <TabsTrigger value="questions">学生提问</TabsTrigger>
            <TabsTrigger value="faq">FAQ管理</TabsTrigger>
            <TabsTrigger value="files">文件管理</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总课程数</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">数字/模拟/基础电路</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总实验数</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalExperiments}</div>
                  <p className="text-xs text-muted-foreground">覆盖多个难度等级</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">学生提问</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                  <p className="text-xs text-muted-foreground">今日新增 {stats.todayQuestions} 条</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">FAQ数量</CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalFAQs}</div>
                  <p className="text-xs text-muted-foreground">已发布 {mockFAQs.filter(f => f.isPublished).length} 条</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">最近提问</CardTitle>
                  <CardDescription>学生最新的问题</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {mockStudentQuestions.slice(0, 5).map((question) => (
                        <div key={question.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="text-sm font-medium">{question.studentName}</span>
                              <Badge variant="outline" className="text-xs">
                                {question.studentNumber}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(question.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {question.experimentName}
                          </p>
                          <p className="text-sm">{question.question}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">热门问题</CardTitle>
                  <CardDescription>访问量最高的FAQ</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {mockFAQs
                        .sort((a, b) => b.viewCount - a.viewCount)
                        .slice(0, 5)
                        .map((faq) => (
                          <div key={faq.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {faq.category}
                              </Badge>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span>{faq.viewCount}</span>
                              </div>
                            </div>
                            <p className="text-sm font-medium">{faq.question}</p>
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
                <h2 className="text-xl font-semibold">实验内容管理</h2>
                <p className="text-muted-foreground">管理实验讲义和课程内容</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                上传新讲义
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <Badge variant="outline">
                        {course.category === 'digital' ? '数字' : 
                         course.category === 'analog' ? '模拟' : '基础'}
                      </Badge>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>实验数量:</span>
                        <span>{course.experiments.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>总时长:</span>
                        <span>{course.experiments.reduce((total, exp) => total + exp.estimatedTime, 0)} 小时</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {course.experiments.map((experiment) => (
                        <div key={experiment.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{experiment.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {experiment.difficulty === 'beginner' ? '初级' : 
                               experiment.difficulty === 'intermediate' ? '中级' : '高级'}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
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
                <h2 className="text-xl font-semibold">FAQ管理</h2>
                <p className="text-muted-foreground">创建和管理常见问题</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建FAQ
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{faq.category}</Badge>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{faq.viewCount}</span>
                        </div>
                        <Badge variant={faq.isPublished ? "default" : "secondary"}>
                          {faq.isPublished ? "已发布" : "草稿"}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {faq.answer}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
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
                <h2 className="text-xl font-semibold">文件管理</h2>
                <p className="text-muted-foreground">管理实验讲义文件</p>
              </div>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                上传文件
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="space-y-1">
                    {filteredFiles.map((file) => (
                      <div key={file.id} className="border-b p-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{file.fileName}</p>
                              <p className="text-sm text-muted-foreground">
                                {file.course} - {file.experiment}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm">{file.size}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(file.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
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