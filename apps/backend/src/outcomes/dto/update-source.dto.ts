import { IsOptional, IsString } from 'class-validator';

export class UpdateOutcomeSourceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
