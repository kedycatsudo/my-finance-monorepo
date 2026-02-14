import { IsString, IsOptional } from 'class-validator';

export class CreateIncomesSourceDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
