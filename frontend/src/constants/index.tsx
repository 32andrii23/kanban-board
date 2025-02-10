import { BoardProfile } from '@/pages/BoardProfile';
import { Boards } from '@/pages/Boards';

export enum RouterKey {
  BOARDS = '/',
  BOARD_PROFILE = '/:boardId',
}

export const routerKeyToComponentMap = {
  [RouterKey.BOARDS]: <Boards />,
  [RouterKey.BOARD_PROFILE]: <BoardProfile />,
};

export enum BackendRoute {
  BOARDS = '/kanban',
  BOARD = '/kanban/:boardId',
  TASKS = '/kanban/:boardId/tasks',
  TASK = '/kanban/:boardId/tasks/:taskId',
  TASK_MOVE = '/kanban/:boardId/tasks/:taskId/move',
}

export enum QueryKey {
  BOARDS = 'BOARDS',
  BOARD = 'BOARD',
}
