import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreataIncomePaymentDto {
  @IsString()
  name!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  payment_type!: string;

  @IsBoolean()
  loop!: boolean;

  @IsString()
  status!: string;

  @IsString()
  date!: string;
}
