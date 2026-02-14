import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ||
        'm6eqjZQK1FZwvUHwvuZt63aAs09Oplq37abmLMKJD1k=',
    });
  }
  async validate(paylaod: any) {
    return { userId: paylaod.sub, username: paylaod.username };
  }
}
