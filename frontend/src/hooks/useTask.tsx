import { BackendRoute, QueryKey } from '@/constants';
import { apiService } from '@/services/api.service';
import { BoardDto, ColumnDto, TaskDto } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useTask = (boardId?: string, taskId?: string) => {
  const queryClient = useQueryClient();

  const createTask = async (createTaskDto: {
    title: string;
    description?: string;
    columnId: string;
  }) => {
    const response = await apiService.post<TaskDto>(
      BackendRoute.TASKS.replace(':boardId', boardId || ''),
      createTaskDto,
    );

    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARDS] });
    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARD] });

    return response.data;
  };

  const createTaskMutation = useMutation({ mutationFn: createTask });

  const updateTask = async (updateTaskDto: {
    title: string;
    description: string;
  }) => {
    const response = await apiService.patch<TaskDto>(
      BackendRoute.TASK.replace(':boardId', boardId || '').replace(
        ':taskId',
        taskId || '',
      ),
      updateTaskDto,
    );

    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARDS] });
    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARD] });

    return response.data;
  };

  const updateTaskMutation = useMutation({ mutationFn: updateTask });

  const deleteTask = async () => {
    await apiService.delete(
      BackendRoute.TASK.replace(':boardId', boardId || '').replace(
        ':taskId',
        taskId || '',
      ),
    );

    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARDS] });
    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARD] });
  };

  const deleteTaskMutation = useMutation({ mutationFn: deleteTask });

  const moveTask = async (moveTaskDto: {
    newColumnId: string;
    newPosition: number;
    taskId: string;
  }) => {
    const response = await apiService.patch<TaskDto>(
      BackendRoute.TASK_MOVE.replace(':boardId', boardId || '').replace(
        ':taskId',
        moveTaskDto.taskId || '',
      ),
      moveTaskDto,
    );

    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARDS] });
    queryClient.invalidateQueries({ queryKey: [QueryKey.BOARD] });

    return response.data;
  };

  // moveTaskMutation with optimistic update
  const moveTaskMutation = useMutation({
    mutationFn: moveTask,
    onMutate: async ({ taskId, newColumnId, newPosition }) => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.BOARD, boardId] });

      const previousBoard = queryClient.getQueryData<BoardDto>([
        QueryKey.BOARD,
        boardId,
      ]);

      if (!previousBoard) return { previousBoard };

      const updatedBoard = JSON.parse(JSON.stringify(previousBoard));

      let movedTask: TaskDto | undefined;

      updatedBoard.columns = updatedBoard.columns.map((column: ColumnDto) => {
        if (column.tasks.some((task) => task.id === taskId)) {
          movedTask = column.tasks.find((task) => task.id === taskId);
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        }
        return column;
      });

      if (!movedTask) return { previousBoard };

      updatedBoard.columns = updatedBoard.columns.map((column: ColumnDto) => {
        if (column.id === newColumnId) {
          return {
            ...column,
            tasks: [
              ...column.tasks.slice(0, newPosition),
              movedTask!,
              ...column.tasks.slice(newPosition),
            ],
          };
        }
        return column;
      });

      queryClient.setQueryData([QueryKey.BOARD, boardId], updatedBoard);

      return { previousBoard };
    },
    onError: (_err, _newTask, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(
          [QueryKey.BOARD, boardId],
          context.previousBoard,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.BOARD, boardId] });
    },
  });

  return {
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    moveTask: moveTaskMutation.mutate,
  };
};
