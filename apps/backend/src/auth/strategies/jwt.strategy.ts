import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
type PayloadType = {
  sub: string;
  username: string;
};
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
  validate(payload: PayloadType) {
    return { userId: payload.sub, username: payload.username };
  }
}
