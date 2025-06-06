import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SignInDto, SignUpDto, TokenDto } from './dto';
import { AuthService } from './auth.service';

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
}
