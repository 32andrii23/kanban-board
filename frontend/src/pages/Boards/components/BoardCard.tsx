import { useMemo, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import TaskDistribution from './TaskDistribution';
import { BoardDto } from '@/types';

interface BoardCardProps {
  board: BoardDto;
}

export const BoardCard: FC<BoardCardProps> = ({ board }) => {
  const columnTaskCounts = useMemo(
    () =>
      board.columns.reduce(
        (acc, column) => ({ ...acc, [column.title]: column.tasks.length }),
        {} as Record<string, number>,
      ),
    [board],
  );

  const total = useMemo(
    () => Object.values(columnTaskCounts).reduce((acc, val) => acc + val, 0),
    [columnTaskCounts],
  );

  return (
    <Card className="transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100">
      <CardHeader>
        <CardTitle>{board.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground font-semibold">
          {Object.entries(columnTaskCounts).map(([title, count]) => (
            <span key={title}>
              {title}: {count}
            </span>
          ))}
        </div>
        <TaskDistribution
          toDo={columnTaskCounts['To Do'] ?? 0}
          inProgress={columnTaskCounts['In Progress'] ?? 0}
          done={columnTaskCounts['Done'] ?? 0}
        />
        <div className="text-right text-sm font-medium text-muted-foreground">
          Total: {total} tasks
        </div>
      </CardContent>
    </Card>
  );
};
