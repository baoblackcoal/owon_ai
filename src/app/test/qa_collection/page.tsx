'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { questions, categories, productModels, tags, getModelsByCategory } from './mockData';
import { QuestionCard } from './components/QuestionCard';
import { Question, QAFilters } from './types';

export default function QACollectionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<QAFilters['sortBy']>('latest');
  const [period, setPeriod] = useState<QAFilters['period']>('all');
  const [tagSearchOpen, setTagSearchOpen] = useState(false);
  
  console.log('问题数量:', questions.length); // 控制台测试输出

  // 获取选中分类的名称
  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.name 
    : '全部分类';

  // 获取选中机型的名称
  const selectedModelName = selectedModel 
    ? productModels.find(model => model.id === selectedModel)?.name 
    : '全部机型';

  // 获取当前分类下的机型列表
  const availableModels = getModelsByCategory(selectedCategory);

  // 当分类改变时，重置机型选择
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSelectedModel(null); // 重置机型选择
  };

  // 标签选择处理
  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // 移除单个标签
  const removeTag = (tagId: number) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  // 获取选中标签的名称列表
  const selectedTagNames = selectedTags
    .map(tagId => tags.find(tag => tag.id === tagId)?.name)
    .filter(Boolean) as string[];

  // 搜索和过滤逻辑
  const filteredQuestions = useMemo(() => {
    let result = questions;

    // 搜索过滤
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      result = result.filter((question) => {
        // 搜索标题
        if (question.title.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // 搜索内容
        if (question.content.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // 搜索标签
        if (question.tags.some(tag => tag.name.toLowerCase().includes(searchLower))) {
          return true;
        }
        
        return false;
      });
    }

    // 分类过滤
    if (selectedCategory) {
      result = result.filter(question => question.category_id === selectedCategory);
    }

    // 机型过滤
    if (selectedModel) {
      result = result.filter(question => question.product_model_id === selectedModel);
    }

    // 标签过滤 (AND逻辑：选中的所有标签都必须包含)
    if (selectedTags.length > 0) {
      result = result.filter(question => 
        selectedTags.every(tagId => 
          question.tags.some(tag => tag.id === tagId)
        )
      );
    }

    // 时间范围过滤（仅在排行模式下生效）
    if (sortBy === 'ranking' && period !== 'all') {
      const now = new Date();
      let timeLimit: Date;
      
      switch (period) {
        case 'week':
          timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          timeLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          timeLimit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          timeLimit = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeLimit = new Date(0);
      }
      
      result = result.filter(question => 
        new Date(question.created_at) >= timeLimit
      );
    }

    // 排序
    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'best':
        result.sort((a, b) => b.likes_count - a.likes_count);
        break;
      case 'ranking':
        result.sort((a, b) => b.views_count - a.views_count);
        break;
    }

    return result;
  }, [searchTerm, selectedCategory, selectedModel, selectedTags, sortBy, period]);

  // 清除所有筛选条件
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedModel(null);
    setSelectedTags([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* 页面标题区域 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          OWON AI 助手 - 问答集
        </h1>
        <p className="text-lg text-muted-foreground">
          汇总、分类并展示所有高质量的问答内容，快速找到技术解决方案和产品信息
        </p>
      </div>

      {/* 搜索区域 */}
      <div className="mb-8 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="搜索问题、内容或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base w-full max-w-2xl"
          />
        </div>

        {/* 过滤器区域 */}
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">筛选条件</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 分类过滤 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">产品分类</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-10">
                    {selectedCategoryName}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => handleCategoryChange(null)}>
                    全部分类
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 机型过滤 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">产品机型</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-10"
                    disabled={!selectedCategory}
                  >
                    {selectedModelName}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setSelectedModel(null)}>
                    全部机型
                  </DropdownMenuItem>
                  {availableModels.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      {model.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 标签过滤 - 使用 Popover + Command */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">技术标签</label>
              <Popover open={tagSearchOpen} onOpenChange={setTagSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={tagSearchOpen}
                    className="w-full justify-between h-10"
                  >
                    {selectedTags.length === 0 
                      ? '选择标签' 
                      : `已选择 ${selectedTags.length} 个标签`
                    }
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="搜索标签..." />
                    <CommandEmpty>没有找到相关标签</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {tags.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => handleTagToggle(tag.id)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {tag.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 选中的标签显示 */}
          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">已选择的标签</label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? (
                    <Badge key={tagId} variant="secondary" className="px-3 py-1">
                      {tag.name}
                      <X 
                        className="ml-2 h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeTag(tagId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* 筛选结果统计和清除按钮 */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              找到 <span className="font-medium text-foreground">{filteredQuestions.length}</span> 个相关问题
              {selectedCategory && (
                <span className="mx-2 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {selectedCategoryName}
                </span>
              )}
              {selectedModel && (
                <span className="mx-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {selectedModelName}
                </span>
              )}
            </div>
            {(searchTerm || selectedCategory || selectedModel || selectedTags.length > 0) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-4 w-4" />
                清除筛选
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 排序选项卡 - 使用 Tabs 组件 */}
      <div className="mb-6">
        <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as QAFilters['sortBy'])}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="latest" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              最新
            </TabsTrigger>
            <TabsTrigger value="best" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              最佳
            </TabsTrigger>
            <TabsTrigger value="ranking" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              排行
            </TabsTrigger>
          </TabsList>

          {/* 时间范围选择器（仅在排行模式下显示） */}
          <TabsContent value="ranking" className="mt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">时间范围:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="min-w-[100px]">
                    {period === 'week' && '本周'}
                    {period === 'month' && '本月'}
                    {period === 'quarter' && '本季度'}
                    {period === 'year' && '本年'}
                    {period === 'all' && '总排行'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPeriod('week')}>
                    本周
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPeriod('month')}>
                    本月
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPeriod('quarter')}>
                    本季度
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPeriod('year')}>
                    本年
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPeriod('all')}>
                    总排行
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 问题列表 */}
      <div className="space-y-6">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">没有找到匹配的问题</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                尝试调整搜索关键词或筛选条件，或者浏览其他分类的问答内容
              </p>
              <div className="flex gap-3 justify-center">
                {(searchTerm || selectedCategory || selectedModel || selectedTags.length > 0) && (
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                    className="px-6"
                  >
                    <X className="mr-2 h-4 w-4" />
                    清除所有筛选
                  </Button>
                )}
                <Button variant="default" onClick={() => setSearchTerm('')}>
                  浏览全部问题
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 