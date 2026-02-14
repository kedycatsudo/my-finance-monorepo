import { IsOptional, IsString } from 'class-validator';

export class UpdateInvestmentSourceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
