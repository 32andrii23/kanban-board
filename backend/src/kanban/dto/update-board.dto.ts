import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  name?: string;
}
