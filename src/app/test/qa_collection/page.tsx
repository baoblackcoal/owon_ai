'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">OWON AI 助手 - 问答集</h1>
        <p className="text-muted-foreground">
          汇总、分类并展示所有高质量的问答内容，快速找到技术解决方案和产品信息
        </p>
      </div>

      {/* 搜索和过滤区域 */}
      <div className="mb-6 space-y-4">
        {/* 搜索框 */}
        <div>
          <Input
            type="text"
            placeholder="搜索问题、内容或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-md"
          />
        </div>

        {/* 过滤器 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <span className="text-sm font-medium">过滤条件:</span>
          <div className="flex flex-wrap gap-2 sm:gap-4">
          
          {/* 分类过滤 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[120px] justify-between">
                {selectedCategoryName}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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

          {/* 机型过滤 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="min-w-[120px] justify-between"
                disabled={!selectedCategory}
              >
                {selectedModelName}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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

          {/* 标签多选过滤 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[120px] justify-between">
                {selectedTags.length === 0 
                  ? '选择标签' 
                  : `已选择 ${selectedTags.length} 个标签`
                }
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>标签筛选</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </DropdownMenuCheckboxItem>
              ))}
              {selectedTags.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedTags([])}>
                    清除所有标签
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        {/* 结果统计 */}
        {(searchTerm || selectedCategory || selectedModel || selectedTags.length > 0) && (
          <p className="text-sm text-muted-foreground">
            找到 {filteredQuestions.length} 个相关问题
            {selectedCategory && (
              <span className="ml-2">
                (分类: {selectedCategoryName})
              </span>
            )}
            {selectedModel && (
              <span className="ml-2">
                (机型: {selectedModelName})
              </span>
            )}
            {selectedTags.length > 0 && (
              <span className="ml-2">
                (标签: {selectedTagNames.join(', ')})
              </span>
            )}
          </p>
        )}
      </div>

      {/* 排序选项卡 */}
      <div className="mb-6">
        <div className="flex overflow-x-auto border-b">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              sortBy === 'latest'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setSortBy('latest')}
          >
            最新
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              sortBy === 'best'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setSortBy('best')}
          >
            最佳
          </button>
                     <button
             className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
               sortBy === 'ranking'
                 ? 'border-primary text-primary'
                 : 'border-transparent text-muted-foreground hover:text-foreground'
             }`}
             onClick={() => setSortBy('ranking')}
           >
             排行
           </button>
         </div>

         {/* 时间范围选择器（仅在排行模式下显示） */}
         {sortBy === 'ranking' && (
           <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
             <span className="text-sm font-medium">时间范围:</span>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline" size="sm">
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
         )}
       </div>

      {/* 问题列表 */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium mb-2">没有找到匹配的问题</h3>
              <p className="text-muted-foreground mb-4">
                尝试调整搜索关键词或过滤条件
              </p>
              <div className="flex gap-2 justify-center">
                {(searchTerm || selectedCategory || selectedModel || selectedTags.length > 0) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(null);
                      setSelectedModel(null);
                      setSelectedTags([]);
                    }}
                  >
                    清除所有筛选
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 