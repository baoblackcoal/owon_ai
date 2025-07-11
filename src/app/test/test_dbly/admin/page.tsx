'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockCourses, Course, Experiment } from '../mockData';
import { Plus, Edit, Trash2, Upload, FileText, BookOpen, Settings, Search, Filter, Calendar, User } from 'lucide-react';

interface ManualFile {
  id: string;
  experimentId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  size: string;
  course: string;
  experiment: string;
}

export default function AdminPage() {
  const [manualFiles, setManualFiles] = useState<ManualFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ManualFile | null>(null);
  const [uploadForm, setUploadForm] = useState({
    experimentId: '',
    fileName: '',
    fileType: 'pdf',
    course: '',
    experiment: ''
  });

  useEffect(() => {
    // 初始化虚假的文件数据
    const initialFiles: ManualFile[] = mockCourses.flatMap(course => 
      course.experiments.map(exp => ({
        id: `file-${exp.id}`,
        experimentId: exp.id,
        fileName: `${exp.name}.pdf`,
        fileType: 'pdf',
        uploadDate: exp.manual.lastUpdated,
        size: `${Math.floor(Math.random() * 5000 + 1000)}KB`,
        course: course.name,
        experiment: exp.name
      }))
    );
    setManualFiles(initialFiles);
  }, []);

  const filteredFiles = manualFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.experiment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || file.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleUpload = () => {
    if (!uploadForm.experimentId || !uploadForm.fileName) return;

    const newFile: ManualFile = {
      id: `file-${Date.now()}`,
      experimentId: uploadForm.experimentId,
      fileName: uploadForm.fileName,
      fileType: uploadForm.fileType,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${Math.floor(Math.random() * 5000 + 1000)}KB`,
      course: uploadForm.course,
      experiment: uploadForm.experiment
    };

    setManualFiles(prev => [...prev, newFile]);
    setIsUploadDialogOpen(false);
    setUploadForm({
      experimentId: '',
      fileName: '',
      fileType: 'pdf',
      course: '',
      experiment: ''
    });
  };

  const handleEdit = (file: ManualFile) => {
    setSelectedFile(file);
    setUploadForm({
      experimentId: file.experimentId,
      fileName: file.fileName,
      fileType: file.fileType,
      course: file.course,
      experiment: file.experiment
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedFile) return;

    setManualFiles(prev => prev.map(file => 
      file.id === selectedFile.id 
        ? { ...file, ...uploadForm, uploadDate: new Date().toISOString().split('T')[0] }
        : file
    ));
    setIsEditDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDelete = (fileId: string) => {
    if (confirm('确定要删除这个文件吗？')) {
      setManualFiles(prev => prev.filter(file => file.id !== fileId));
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'doc':
      case 'docx': return 'bg-blue-100 text-blue-800';
      case 'md': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">实验内容管理后台</h1>
            <p className="text-gray-600 mt-2">管理实验讲义和教学资源</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <User className="w-4 h-4 mr-1" />
              管理员
            </Badge>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <FileText className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">实验文件</p>
                <p className="text-2xl font-bold">{manualFiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Upload className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">今日上传</p>
                <p className="text-2xl font-bold">
                  {manualFiles.filter(f => f.uploadDate === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">系统状态</p>
                <p className="text-2xl font-bold text-green-600">正常</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索文件或实验..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="all">所有课程</option>
            {mockCourses.map(course => (
              <option key={course.id} value={course.name}>{course.name}</option>
            ))}
          </select>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              上传新文件
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上传实验讲义</DialogTitle>
              <DialogDescription>
                选择实验并上传对应的讲义文件
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course">课程</Label>
                <select
                  id="course"
                  value={uploadForm.course}
                  onChange={(e) => {
                    setUploadForm(prev => ({ ...prev, course: e.target.value, experiment: '', experimentId: '' }));
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">请选择课程</option>
                  {mockCourses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="experiment">实验</Label>
                <select
                  id="experiment"
                  value={uploadForm.experimentId}
                  onChange={(e) => {
                    const selectedExp = mockCourses
                      .flatMap(c => c.experiments)
                      .find(exp => exp.id === e.target.value);
                    setUploadForm(prev => ({ 
                      ...prev, 
                      experimentId: e.target.value,
                      experiment: selectedExp?.name || ''
                    }));
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!uploadForm.course}
                >
                  <option value="">请选择实验</option>
                  {mockCourses
                    .find(c => c.name === uploadForm.course)
                    ?.experiments.map(exp => (
                      <option key={exp.id} value={exp.id}>{exp.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <Label htmlFor="fileName">文件名</Label>
                <Input
                  id="fileName"
                  value={uploadForm.fileName}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, fileName: e.target.value }))}
                  placeholder="实验讲义.pdf"
                />
              </div>
              <div>
                <Label htmlFor="fileType">文件类型</Label>
                <select
                  id="fileType"
                  value={uploadForm.fileType}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, fileType: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">Word</option>
                  <option value="md">Markdown</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleUpload}>
                  上传
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 文件列表 */}
      <Card>
        <CardHeader>
          <CardTitle>实验讲义文件</CardTitle>
          <CardDescription>
            管理所有实验讲义文件，支持上传、更新和删除操作
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">文件名</th>
                  <th className="text-left py-3 px-4">课程</th>
                  <th className="text-left py-3 px-4">实验</th>
                  <th className="text-left py-3 px-4">类型</th>
                  <th className="text-left py-3 px-4">大小</th>
                  <th className="text-left py-3 px-4">更新时间</th>
                  <th className="text-left py-3 px-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{file.course}</td>
                    <td className="py-3 px-4">{file.experiment}</td>
                    <td className="py-3 px-4">
                      <Badge className={getFileTypeColor(file.fileType)}>
                        {file.fileType.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{file.size}</td>
                    <td className="py-3 px-4 text-gray-600">{file.uploadDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(file)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredFiles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">没有找到匹配的文件</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑文件信息</DialogTitle>
            <DialogDescription>
              更新文件的基本信息和关联实验
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-fileName">文件名</Label>
              <Input
                id="edit-fileName"
                value={uploadForm.fileName}
                onChange={(e) => setUploadForm(prev => ({ ...prev, fileName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-course">课程</Label>
              <select
                id="edit-course"
                value={uploadForm.course}
                onChange={(e) => setUploadForm(prev => ({ ...prev, course: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                {mockCourses.map(course => (
                  <option key={course.id} value={course.name}>{course.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-experiment">实验</Label>
              <Input
                id="edit-experiment"
                value={uploadForm.experiment}
                onChange={(e) => setUploadForm(prev => ({ ...prev, experiment: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleUpdate}>
                更新
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 