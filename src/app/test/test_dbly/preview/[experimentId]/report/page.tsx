'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockCourses, generateMockPreviewReport, AITutorConfig, PreviewReport, Experiment } from '../../../mockData';
import { ArrowLeft, Download, FileText, Bot, Clock, Sparkles, BookOpen, Lightbulb, AlertTriangle, Settings2 } from 'lucide-react';

export default function PreviewReportPage() {
  const params = useParams();
  const router = useRouter();
  const experimentId = params.experimentId as string;
  
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [report, setReport] = useState<PreviewReport | null>(null);
  const [tutorConfig, setTutorConfig] = useState<AITutorConfig | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const foundExperiment = mockCourses
      .flatMap(course => course.experiments)
      .find(exp => exp.id === experimentId);
    
    if (foundExperiment) {
      setExperiment(foundExperiment);
      
      // 从本地存储获取配置
      const savedConfig = localStorage.getItem(`tutor-config-${experimentId}`);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setTutorConfig(config);
        
        // 生成报告
        const generatedReport = generateMockPreviewReport(experimentId, config);
        setReport(generatedReport);
        
        // 保存报告到本地存储
        localStorage.setItem(`preview-report-${experimentId}`, JSON.stringify(generatedReport));
      }
    }
  }, [experimentId]);

  const handleBack = () => {
    router.push('/test/test_dbly');
  };

  const handleExportPDF = () => {
    if (!report) return;
    
    // 模拟PDF导出
    const blob = new Blob([report.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${experiment?.name}-预习报告.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!report) return;
    
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${experiment?.name}-预习报告.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'objective': return <BookOpen className="w-5 h-5" />;
      case 'theory': return <Lightbulb className="w-5 h-5" />;
      case 'equipment': return <Settings2 className="w-5 h-5" />;
      case 'procedure': return <FileText className="w-5 h-5" />;
      case 'parameters': return <Settings2 className="w-5 h-5" />;
      case 'questions': return <Lightbulb className="w-5 h-5" />;
      case 'troubleshooting': return <AlertTriangle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'objective': return 'text-blue-600';
      case 'theory': return 'text-green-600';
      case 'equipment': return 'text-purple-600';
      case 'procedure': return 'text-orange-600';
      case 'parameters': return 'text-red-600';
      case 'questions': return 'text-indigo-600';
      case 'troubleshooting': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (!experiment || !report || !tutorConfig) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-gray-500">正在加载预习报告...</p>
          <Button onClick={handleBack} className="mt-4">
            返回主页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex gap-6">
        {/* 左侧导航栏 */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-6">
            <Button variant="outline" onClick={handleBack} className="w-full mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回主页
            </Button>
            
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">导航</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {report.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={getSectionColor(section.type)}>
                        {getSectionIcon(section.type)}
                      </div>
                      <span>{section.title}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">导出报告</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" onClick={handleExportPDF} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  导出 TXT
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportMarkdown} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  导出 Markdown
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1">
          {/* 报告头部 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-green-500" />
                <div className="flex-1">
                  <CardTitle className="text-2xl">{experiment.name} - AI预习指南</CardTitle>
                  <CardDescription className="mt-2">
                    由AI导师根据您的学习偏好生成 • 生成时间：{new Date(report.generatedAt).toLocaleString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>预计时间：{experiment.estimatedTime} 分钟</span>
                </div>
                <Badge variant="outline">
                  深度：{tutorConfig.depth === 'beginner' ? '入门' : tutorConfig.depth === 'standard' ? '标准' : '深入'}
                </Badge>
                <Badge variant="outline">
                  风格：{tutorConfig.style === 'academic' ? '严谨学术' : tutorConfig.style === 'vivid' ? '生动形象' : '循循善诱'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 报告内容 */}
          <div className="space-y-6">
            {report.sections.map((section) => (
              <Card 
                key={section.id} 
                id={section.id}
                className={`transition-all ${
                  activeSection === section.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={getSectionColor(section.type)}>
                      {getSectionIcon(section.type)}
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {section.content.split('\n').map((paragraph, idx) => (
                      <div key={idx} className="mb-3">
                        {paragraph.startsWith('•') ? (
                          <div className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{paragraph.substring(1).trim()}</span>
                          </div>
                        ) : paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {paragraph.slice(2, -2)}
                          </h4>
                        ) : paragraph.match(/^\d+\./) ? (
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-blue-600 mt-0.5">
                              {paragraph.match(/^\d+\./)?.[0]}
                            </span>
                            <span>{paragraph.replace(/^\d+\.\s*/, '')}</span>
                          </div>
                        ) : paragraph.trim() ? (
                          <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 底部操作 */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">预习指南已准备完成</p>
                    <p className="text-sm text-gray-600">现在可以开始实验，遇到问题时可以随时向AI导师提问</p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    router.push(`/test/test_dbly/experiment/${experimentId}`);
                  }}
                  className="px-6"
                >
                  开始实验
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 