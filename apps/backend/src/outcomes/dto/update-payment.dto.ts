import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UpdateOutcomePaymentDto {
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
  @IsDateString()
  payment_circle_date?: string;

  @IsOptional()
  @IsBoolean()
  loop?: boolean;

  @IsOptional()
  @IsString()
  status?: string;
}
