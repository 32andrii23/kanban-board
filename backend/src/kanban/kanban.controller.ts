import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { KanbanService } from './kanban.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Controller('kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Post()
  createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.kanbanService.createBoard(createBoardDto);
  }

  @Get()
  getAllBoards(@Query('search') search: string) {
    return this.kanbanService.getAllBoards(search);
  }

  @Get(':boardId')
  getBoard(@Param('boardId') boardId: string) {
    return this.kanbanService.getBoard(boardId);
  }

  @Patch(':boardId')
  updateBoard(
    @Param('boardId') boardId: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.kanbanService.updateBoard(boardId, updateBoardDto);
  }

  @Delete(':boardId')
  deleteBoard(@Param('boardId') boardId: string) {
    return this.kanbanService.deleteBoard(boardId);
  }

  @Post(':boardId/tasks')
  createTask(
    @Param('boardId') boardId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.kanbanService.createTask(boardId, createTaskDto);
  }

  @Patch(':boardId/tasks/:taskId')
  updateTask(
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.kanbanService.updateTask(boardId, taskId, updateTaskDto);
  }

  @Delete(':boardId/tasks/:taskId')
  deleteTask(
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.kanbanService.deleteTask(boardId, taskId);
  }

  @Patch(':boardId/tasks/:taskId/move')
  moveTask(
    @Param('boardId') boardId: string,
    @Param('taskId') taskId: string,
    @Body() moveTaskDto: MoveTaskDto,
  ) {
    return this.kanbanService.moveTask(boardId, taskId, moveTaskDto);
  }
}
