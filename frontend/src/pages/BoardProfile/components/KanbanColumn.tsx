import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import TaskItem from './TaskItem';
import { TaskDto } from '@/types';

interface KanbanColumnProps {
  title: string;
  tasks: TaskDto[];
  id: string;
}

export default function KanbanColumn({ title, tasks, id }: KanbanColumnProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <SortableContext
          id={id}
          items={tasks.length > 0 ? tasks : [{ id: 1 }]}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {tasks.length === 0 && (
              <div className="sr-only">
                <TaskItem task={{ id, columnId: id } as TaskDto} />
              </div>
            )}
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </SortableContext>
      </CardContent>
    </Card>
  );
}
