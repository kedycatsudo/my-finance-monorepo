import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateOutcomeSourceDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
