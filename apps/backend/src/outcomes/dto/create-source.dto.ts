import { IsString, IsOptional } from 'class-validator';

export class CreateOutcomeSourceDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
