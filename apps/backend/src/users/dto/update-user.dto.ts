import {
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsDateString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsOptional()
  @Length(3, 50)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(8, 72)
  password?: string;

  @IsDateString()
  monthly_circle_date?: string;
}
