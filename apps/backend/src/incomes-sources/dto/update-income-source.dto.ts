import { IsOptional, IsString } from 'class-validator';

export class UpdateIncomeSourceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
