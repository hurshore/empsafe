import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { OtpService } from 'src/otp/otp.service';
import { SendOtpDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private otpService: OtpService,
  ) {}

  async signup(dto: SignupDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    try {
      // save the new user in the db
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

  async sendOtp(dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.email);
  }
}
