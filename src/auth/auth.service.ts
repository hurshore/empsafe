import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { OtpService } from 'src/otp/otp.service';
import { SendOtpDto, SigninDto, SignupDto } from './dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private otpService: OtpService,
  ) {}

  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);
    try {
      const data = { ...dto, hash, emailVerified: false };
      delete data.password;

      const user = await this.prisma.user.create({ data });
      this.sendOtp({ email: dto.email });

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'user with email or phone already exists',
          );
        }
      }
      throw e;
    }
  }

  async signin(dto: SigninDto) {
    const { user } = await this.verifyUserExists(dto.email);

    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password incorrect throw exception
    if (!pwMatches) throw new BadRequestException('incorrect credentials');
    if (!user.emailVerified)
      throw new BadRequestException('please verify your email');

    return this.returnUser(user);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const { user } = await this.verifyUserExists(dto.email);
    if (user.emailVerified)
      throw new BadRequestException('email is already verified');

    const isValid = await this.otpService.verifyOtp(dto.email, dto.otp);
    if (!isValid) throw new BadRequestException('Invalid OTP');
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { emailVerified: true },
    });
  }

  async sendOtp(dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.email);
  }

  private async returnUser(user: User) {
    delete user.hash;
    const token = (await this.signToken(user.id, user.email)).access_token;
    return { ...user, token };
  }

  private async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    return { access_token: token };
  }

  private async userExists(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return { exists: !!user, user };
  }

  private async verifyUserExists(email: string) {
    const data = await this.userExists(email);
    if (!data.exists) throw new BadRequestException('user does not exist');
    return data;
  }
}
