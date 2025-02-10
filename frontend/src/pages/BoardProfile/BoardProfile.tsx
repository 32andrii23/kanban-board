import { useCallback, useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import KanbanColumn from './components/KanbanColumn';
import AddTaskDialog from './components/AddTaskDialog';
import { useNavigate, useParams } from 'react-router-dom';
import { RouterKey } from '@/constants';
import { useBoard } from '@/hooks/useBoard';
import { useTask } from '@/hooks/useTask';
import EditBoardDialog from './components/EditBoardDialog';
import ConfirmDeletionDialog from '@/components/ui/ConfirmDeletionDialog';

export const BoardProfile = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const { board, updateBoard, deleteBoard } = useBoard(boardId);
  const { createTask, moveTask } = useTask(boardId);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) return;

      if (active.id !== over.id) {
        const newColumnId = over.data.current?.sortable.containerId || over.id;
        const newPosition = over.data.current?.sortable.index + 1;

        moveTask({
          taskId: active.id.toString(),
          newColumnId,
          newPosition,
        });
      }
    },
    [moveTask],
  );

  const addTask = useCallback(
    (createTaskDto: {
      title: string;
      description?: string;
      columnId: string;
    }) => {
      createTask(createTaskDto);
    },
    [createTask],
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <Button
        className="group"
        variant="ghost"
        onClick={() => navigate(RouterKey.BOARDS)}
      >
        <ChevronLeft className="group-hover:rotate-[360deg] transition mr-2 h-4 w-4" />
        Back to Boards
      </Button>
      <div className="mb-8 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold mr-4">Board - {board?.name}</h1>
          <Button
            onClick={() => setIsEditBoardOpen(true)}
            variant="outline"
            size="icon"
          >
            <Pencil />
          </Button>
          <Button
            onClick={() => setIsDeleteBoardOpen(true)}
            variant="destructive"
            size="icon"
          >
            <Trash2 />
          </Button>
        </div>
        <Button onClick={() => setIsAddTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {board?.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              tasks={column.tasks}
              id={column.id}
            />
          ))}
        </div>
      </DndContext>
      <AddTaskDialog
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAdd={addTask}
        columns={board?.columns ?? []}
      />
      <EditBoardDialog
        isOpen={isEditBoardOpen}
        onClose={() => setIsEditBoardOpen(false)}
        onEdit={updateBoard}
        initialName={board?.name ?? ''}
      />
      <ConfirmDeletionDialog
        isOpen={isDeleteBoardOpen}
        onDelete={deleteBoard}
        onClose={() => setIsDeleteBoardOpen(false)}
        title="Are you sure you want to delete this board?"
        description="This action cannot be undone."
      />
    </div>
  );
};
