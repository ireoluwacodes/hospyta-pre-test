import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    profileImage: string,
    fullName: string,
  ) {
    const user = await this.usersService.findOne({ email });
    if (user) {
      throw new ForbiddenException('User already Exists');
    }
    const hash = await this.passwordService.hashPassword(password);
    const dto = { fullName, email, password: hash, profileImage };
    const { _doc } = await this.usersService.create(dto);
    return {
      ..._doc,
      password,
    };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await this.passwordService.comparePassword(
      password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('password mismatch');
    }
    const payload = { sub: user._id, email: user.email };
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '4d',
    });
    const dto = {
      refresh_token,
    };
    await this.usersService.update(user._id, dto);
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token,
    };
  }

  async refresh(token: string) {
    if (!token) {
      throw new UnauthorizedException('No refresh token in cookie');
    }
    const decoded = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.findOne({ _id: decoded.sub });
    if (!user || !user.refresh_token || token != user.refresh_token) {
      const dto = {
        refresh_token: '',
      };
      await this.usersService.update(user._id, dto);
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logOut(id: string) {
    const dto = {
      refresh_token: '',
    };
    await this.usersService.update(id, dto);
    return {
      message: 'success',
    };
  }
}
