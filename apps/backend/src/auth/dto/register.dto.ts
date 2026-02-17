import { IsString, IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  monthly_circle_date!: string;

  @IsString()
  @Length(8, 72)
  password!: string;
}
