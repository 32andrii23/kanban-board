import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { TaskDto } from '@/types';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTask } from '@/hooks/useTask';
import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: TaskDto;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { boardId } = useParams();

  const [isEditing, setIsEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: task.id,
    data: { task },
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const [updatedTask, setUpdatedTask] = useState<{
    title: string;
    description: string;
  }>({
    title: task.title,
    description: task.description,
  });

  const { updateTask, deleteTask } = useTask(boardId, task.id);

  const handleSave = useCallback(() => {
    updateTask({
      title: updatedTask.title,
      description: updatedTask.description,
    });
    setIsEditing(false);
  }, [updatedTask]);

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <CardContent className={cn('p-4', isEditing && 'space-y-2')}>
          {isEditing ? (
            <Input
              className="h-5 pl-1"
              value={updatedTask.title}
              onChange={(e) =>
                setUpdatedTask({ ...updatedTask, title: e.target.value })
              }
            />
          ) : (
            <p className="font-semibold">{task.title}</p>
          )}
          {isEditing ? (
            <Input
              className="h-5 pl-1"
              value={updatedTask.description}
              onChange={(e) =>
                setUpdatedTask({
                  ...updatedTask,
                  description: e.target.value,
                })
              }
            />
          ) : (
            <p className="text-muted-foreground">{task.description}</p>
          )}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button
            className="h-10"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            variant={isEditing ? 'default' : 'outline'}
            size={isEditing ? 'sm' : 'icon'}
          >
            {isEditing ? 'Save' : <Pencil />}
          </Button>
          <Button
            onClick={() => deleteTask()}
            variant="destructive"
            size="icon"
          >
            <Trash2 />
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}
