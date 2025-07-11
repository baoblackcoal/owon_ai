'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { mockCourses, mockTutorStyles, AITutorConfig, Experiment } from '../../mockData';
import { ArrowLeft, Bot, Clock, BookOpen, Settings, Sparkles } from 'lucide-react';

export default function PreviewConfigPage() {
  const params = useParams();
  const router = useRouter();
  const experimentId = params.experimentId as string;
  
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [tutorConfig, setTutorConfig] = useState<AITutorConfig>({
    depth: 'standard',
    style: 'encouraging'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const foundExperiment = mockCourses
      .flatMap(course => course.experiments)
      .find(exp => exp.id === experimentId);
    
    if (foundExperiment) {
      setExperiment(foundExperiment);
    }
  }, [experimentId]);

  const handleGenerateReport = async () => {
    if (!experiment) return;
    
    setIsGenerating(true);
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 保存配置到本地存储
    localStorage.setItem(`tutor-config-${experimentId}`, JSON.stringify(tutorConfig));
    
    // 跳转到报告页面
    router.push(`/test/test_dbly/preview/${experimentId}/report`);
  };

  const handleBack = () => {
    router.push('/test/test_dbly');
  };

  if (!experiment) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-gray-500">实验不存在</p>
          <Button onClick={handleBack} className="mt-4">
            返回主页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* 返回按钮 */}
      <Button variant="outline" onClick={handleBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回主页
      </Button>

      {/* 实验信息 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <div>
              <CardTitle className="text-xl">{experiment.name}</CardTitle>
              <CardDescription>{experiment.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {experiment.estimatedTime} 分钟
            </div>
            <Badge variant={
              experiment.difficulty === 'beginner' ? 'default' :
              experiment.difficulty === 'intermediate' ? 'secondary' : 'destructive'
            }>
              {experiment.difficulty === 'beginner' ? '入门' :
               experiment.difficulty === 'intermediate' ? '中级' : '高级'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI导师配置 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-green-500" />
            <div>
              <CardTitle>AI导师配置</CardTitle>
              <CardDescription>
                选择适合你的学习风格和深度等级，AI导师将据此为你生成个性化的预习指南
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 深度等级选择 */}
          <div>
            <Label className="text-base font-medium mb-3 block">深度等级</Label>
            <RadioGroup 
              value={tutorConfig.depth} 
              onValueChange={(value) => setTutorConfig(prev => ({ ...prev, depth: value as any }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockTutorStyles.depth.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`depth-${option.value}`} />
                    <Label htmlFor={`depth-${option.value}`} className="flex-1 cursor-pointer">
                      <div className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* 沟通风格选择 */}
          <div>
            <Label className="text-base font-medium mb-3 block">沟通风格</Label>
            <RadioGroup 
              value={tutorConfig.style} 
              onValueChange={(value) => setTutorConfig(prev => ({ ...prev, style: value as any }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockTutorStyles.style.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`style-${option.value}`} />
                    <Label htmlFor={`style-${option.value}`} className="flex-1 cursor-pointer">
                      <div className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 预习内容预览 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <div>
              <CardTitle>预习指南将包含</CardTitle>
              <CardDescription>根据你的配置，AI导师将生成以下内容</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                实验目的与意义
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                核心原理讲解
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                所需器材清单
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                详细操作步骤
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                关键参数设置
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                思考题与讨论
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                常见问题预判
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                扩展学习建议
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 生成按钮 */}
      <div className="flex justify-center">
        <Button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          size="lg"
          className="px-8"
        >
          {isGenerating ? (
            <>
              <Settings className="w-4 h-4 mr-2 animate-spin" />
              AI导师正在生成预习指南...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              生成个性化预习指南
            </>
          )}
        </Button>
      </div>

      {/* 当前配置显示 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">当前配置：</p>
        <div className="flex gap-4 text-sm">
          <span className="font-medium">
            深度等级：{mockTutorStyles.depth.find(d => d.value === tutorConfig.depth)?.label}
          </span>
          <span className="font-medium">
            沟通风格：{mockTutorStyles.style.find(s => s.value === tutorConfig.style)?.label}
          </span>
        </div>
      </div>
    </div>
  );
} 