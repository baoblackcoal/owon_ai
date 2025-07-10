import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '../types';
import { getCategoryName, getModelName } from '../mockData';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      {/* 标题和内容预览 - 紧凑化 */}
      <div className="mb-3">
        <h3 className="text-base font-semibold mb-1 line-clamp-2 hover:text-primary">
          {question.title}
        </h3>
        <p className="text-muted-foreground text-xs line-clamp-2">
          {question.content}
        </p>
      </div>

      {/* 标签区域 - 紧凑化 */}
      <div className="flex flex-wrap gap-1 mb-3">
        <Badge variant="outline" className="text-xs px-2 py-0.5">
          {getCategoryName(question.category_id)}
        </Badge>
        <Badge variant="secondary" className="text-xs px-2 py-0.5">
          {getModelName(question.product_model_id)}
        </Badge>
        {question.tags.map((tag) => (
          <Badge key={tag.id} variant="default" className="text-xs px-2 py-0.5">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* 统计信息和时间 - 紧凑化 */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span>👁️</span>
            <span>{question.views_count}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>👍</span>
            <span>{question.likes_count}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>💬</span>
            <span>{question.replies_count}</span>
          </span>
        </div>
        <div className="text-xs">
          <span>最后更新: {formatDate(question.updated_at)}</span>
        </div>
      </div>
    </Card>
  );
} 