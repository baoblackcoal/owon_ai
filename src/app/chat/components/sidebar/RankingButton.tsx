import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface RankingButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export function RankingButton({ isExpanded, onClick }: RankingButtonProps) {
  return (
    <div className="p-2 border-t">
      <Button
        variant="outline"
        className="w-full"
        onClick={onClick}
      >
        <Trophy className="h-4 w-4 text-yellow-500" />
        {isExpanded && <span className="ml-2">问答排行榜</span>}
      </Button>
    </div>
  );
} 