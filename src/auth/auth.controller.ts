import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { ProtectedRequest } from './interfaces/request.interface';
import { SignUpDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.register(
      signUpDto.email,
      signUpDto.password,
      signUpDto.profileImage,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    response.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 96 * 60 * 60 * 1000,
      sameSite: 'none',
    });
    return {
      ...result,
      refresh_token: '',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Req() request: Request) {
    const { refresh_token } = request.cookies;
    return this.authService.refresh(refresh_token);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async signOut(
    @Res({ passthrough: true }) response: Response,
    @Req() request: ProtectedRequest,
  ) {
    const { sub } = request.user;
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
    });
    return this.authService.logOut(sub);
  }
}
