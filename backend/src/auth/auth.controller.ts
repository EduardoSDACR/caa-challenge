import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Post,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { SignInDto, SignUpDto, TokenDto } from './dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard/jwt.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() input: SignInDto): Promise<TokenDto> {
    return this.authService.signIn(input);
  }

  @Post('signup')
  signUp(@Body() input: SignUpDto): Promise<TokenDto> {
    return this.authService.signUp(input);
  }

  @UseGuards(JwtGuard)
  @Delete('logout')
  logOut(@Headers('Authorization') jwt: string): Promise<void> {
    return this.authService.logOut(jwt.replace('Bearer ', ''));
  }
}
