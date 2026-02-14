import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateOutcomePaymentDto {
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
}
