import { BackendRoute, QueryKey } from '@/constants';
import { apiService } from '@/services/api.service';
import { TaskDto } from '@/types';
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

  const moveTaskMutation = useMutation({ mutationFn: moveTask });

  return {
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    moveTask: moveTaskMutation.mutate,
  };
};
