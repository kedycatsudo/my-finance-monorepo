import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateInvestmentItemDto {
  @IsString()
  asset_name!: string;

  @IsOptional()
  @IsString()
  term?: string;

  @IsNumber()
  invested_amount!: number;

  @IsDateString()
  entry_date!: string;

  @IsOptional()
  @IsDateString()
  exit_date?: string;

  @IsString()
  result!: string;

  @IsOptional()
  @IsNumber()
  result_amount?: number;

  @IsString()
  status!: string;
}
