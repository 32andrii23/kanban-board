export interface BoardDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  columns: ColumnDto[];
}

export interface ColumnDto {
  id: string;
  title: string;
  boardId: string;
  board: BoardDto;
  tasks: TaskDto[];
}

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  order: number;
  columnId: string;
  column: ColumnDto;
}
