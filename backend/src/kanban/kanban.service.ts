import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { PrismaPromise } from '@prisma/client';

@Injectable()
export class KanbanService {
  constructor(private prisma: PrismaService) {}

  async createBoard(createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({
      data: {
        name: createBoardDto.name,
        columns: {
          create: [
            { title: 'To Do' },
            { title: 'In Progress' },
            { title: 'Done' },
          ],
        },
      },
      include: { columns: true },
    });
  }

  async getAllBoards(search?: string) {
    const boards = await this.prisma.board.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          {
            columns: {
              some: {
                tasks: {
                  some: {
                    title: { contains: search, mode: 'insensitive' },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        columns: {
          include: { tasks: true },
        },
      },
    });

    return boards;
  }

  async getBoard(id: string) {
    return this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          include: {
            tasks: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async updateBoard(id: string, updateBoardDto: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
    });
  }

  async deleteBoard(id: string) {
    return this.prisma.board.delete({ where: { id } });
  }

  async createTask(
    boardId: string,
    { title, description, columnId }: CreateTaskDto,
  ) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) throw new NotFoundException('Board not found');

    const tasksCount = await this.prisma.task.count({ where: { columnId } });
    return this.prisma.task.create({
      data: {
        title,
        description,
        order: tasksCount + 1,
        columnId,
      },
    });
  }

  async updateTask(
    boardId: string,
    id: string,
    { title, description }: UpdateTaskDto,
  ) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) throw new NotFoundException('Board not found');

    return this.prisma.task.update({
      where: { id },
      data: { title, description },
    });
  }

  async deleteTask(boardId: string, id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) throw new NotFoundException('Board not found');

    return this.prisma.task.delete({ where: { id } });
  }

  async moveTask(
    boardId: string,
    taskId: string,
    { newColumnId, newPosition }: MoveTaskDto,
  ) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) throw new NotFoundException('Board not found');

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task) throw new NotFoundException('Task not found');

    const tasksInNewColumn = await this.prisma.task.count({
      where: { columnId: newColumnId },
    });

    if (newPosition < 1) {
      newPosition = 1;
    }

    if (newPosition > tasksInNewColumn + 1) {
      throw new NotFoundException('Position is not valid');
    }

    const isSameColumn = task.columnId === newColumnId;
    const isMovingDown = newPosition > task.order;

    const transactions: PrismaPromise<any>[] = [];

    if (!isSameColumn) {
      const tasksInOldColumn = await this.prisma.task.findMany({
        where: {
          columnId: task.columnId,
          order: { gt: task.order },
        },
      });

      transactions.push(
        this.prisma.task.updateMany({
          where: { id: { in: tasksInOldColumn.map((t) => t.id) } },
          data: { order: { decrement: 1 } },
        }),
      );
    }

    const tasksToUpdate = await this.prisma.task.findMany({
      where: {
        columnId: newColumnId,
        order: isSameColumn
          ? isMovingDown
            ? { gt: task.order, lte: newPosition }
            : { gte: newPosition, lt: task.order }
          : { gte: newPosition },
        NOT: { id: taskId },
      },
    });

    transactions.push(
      this.prisma.task.update({
        where: { id: task.id },
        data: { columnId: newColumnId, order: newPosition },
      }),
    );

    transactions.push(
      this.prisma.task.updateMany({
        where: { id: { in: tasksToUpdate.map((t) => t.id) } },
        data: { order: { decrement: isSameColumn && isMovingDown ? 1 : -1 } },
      }),
    );

    await this.prisma.$transaction(transactions);

    return { message: 'Task moved successfully' };
  }
}
