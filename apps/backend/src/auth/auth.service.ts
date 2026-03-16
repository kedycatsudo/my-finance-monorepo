import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
type LoggedInUser = {
  id: string;
  username: string;
  // add any other fields returned from validateUser
};
type ValidatedUser = {
  id: string;
  username: string;
  email: string;
  monthly_circle_date: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    const user = await this.usersService.findByUsername(username);
    //bcrypt compare
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: LoggedInUser) {
    const payload = { username: user.username, sub: user.id };

    const access_token = this.jwtService.sign(payload);

    // run the monthly reset silently - never block login
    try {
      await this.usersService.runMonthlyReset(user.id);
    } catch (e) {
      console.warn('Monthly reset failed for user', user.id, e);
    }
    return { access_token, user: user };
  }

  //Register Logic
  async register(RegisterDto: RegisterDto) {
    const { username, email, monthly_circle_date, password } = RegisterDto;
    // Check if user or email exists
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('User already exist.');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      username,
      email,
      monthly_circle_date,
      password: hashedPassword,
    });
    const { password: _pw, ...userWithoutPassword } = user;
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user: userWithoutPassword };
  }
}
