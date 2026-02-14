import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 72)
  // @Matches(/some-secure-pattern/, { message: 'Password too weak' }) // optional
  password!: string;
}
