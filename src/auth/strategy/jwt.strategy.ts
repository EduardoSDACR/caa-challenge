import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET_KEY') || 'SECRET',
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.prisma.token.findUnique({
      where: {
        jti: payload.sub,
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid authentication');
    }

    return user;
  }
}
