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
    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
      {/* 标题和内容预览 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary">
          {question.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {question.content}
        </p>
      </div>

      {/* 标签区域 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="text-xs">
          {getCategoryName(question.category_id)}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {getModelName(question.product_model_id)}
        </Badge>
        {question.tags.map((tag) => (
          <Badge key={tag.id} variant="default" className="text-xs">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* 统计信息和时间 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
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