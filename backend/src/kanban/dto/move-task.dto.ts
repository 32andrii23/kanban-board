import { IsString, IsNumber } from 'class-validator';

export class MoveTaskDto {
  @IsString()
  newColumnId: string;

  @IsNumber()
  newPosition: number;
}
