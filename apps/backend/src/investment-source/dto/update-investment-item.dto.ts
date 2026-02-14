import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class UpdateInvestmentItemDto {
  @IsOptional()
  @IsString()
  asset_name?: string;

  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsNumber()
  invested_amount?: number;

  @IsOptional()
  @IsDateString()
  entry_date?: string;

  @IsOptional()
  @IsDateString()
  exit_date?: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsNumber()
  result_amount?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
