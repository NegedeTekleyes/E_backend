
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = this.jwtService.sign({ email: dto.email }, { expiresIn: '1d' });

    try { 
       await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: dto.role,
          name: dto.name,
          phone: dto.phone || null, //optional
          verificationToken,
        },
      });

      const emailResult = await this.emailService.sendVerificationEmail(dto.email, verificationToken, 'en');
      if (!emailResult.success) {
        return {
          message: 'User registered successfully. Email sending failed - use this token to verify manually.',
          verificationToken,
        };
      }

      return { message: 'User registered successfully. Please verify your email.' };
    } catch (error) { // Catch block now properly aligned
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Email or phone already exists');
      }
      throw error; // Re-throw unexpected errors
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }],
      },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async verifyEmail(token: string) {
    try {
      const { email } = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user || user.verificationToken !== token) {
        throw new BadRequestException('Invalid or expired verification token');
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, verificationToken: null },
      });
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) throw new UnauthorizedException('User not found!')
    return user;
  }

  async refreshToken(refreshToken: string) {
    try {
      const { sub } = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: sub },
      });
      if (!user || !user.refreshToken || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'User logged out successfully' };
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '1h' }) };
  }
}