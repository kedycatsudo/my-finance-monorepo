import { IsString, IsOptional } from 'class-validator';

export class CreateInvestmentSourceDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  type!: string; // outcome, income, investment
}
