import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateIncomePaymentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  payment_type?: string;

  @IsOptional()
  @IsBoolean()
  loop?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  payment_circle_date?: string;
}
