import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client'; // Use Prisma's Role enum
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto, requestingUserRole: Role) {
    if (requestingUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can create users');
    }
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    if (existingUser) throw new ForbiddenException('Email or phone already exists');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role || Role.STUDENT, // Default to STUDENT
        name: dto.name,
        phone: dto.phone,
      },
    });
    return this.mapUserToResponseDto(user);
  }

  async getUserById(id: number, requestingUserId: number, requestingUserRole: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, enrollments: { include: { course: true } } },
    });
    if (!user) throw new NotFoundException('User not found');
    if (requestingUserRole !== Role.ADMIN && requestingUserId !== id) {
      throw new ForbiddenException('You can only view your own data');
    }
    return this.mapUserToResponseDto(user);
  }

  async getAllUsers(requestingUserRole: Role, filterRole?: Role) {
    if (requestingUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can view all users');
    }
      return this.prisma.user.findMany({
        where: filterRole ? { role: filterRole } : undefined,
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUser(id: number, dto: UpdateUserDto, requestingUserId: number, requestingUserRole: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (requestingUserRole !== Role.ADMIN && requestingUserId !== id) {
      throw new ForbiddenException('You can only update your own data');
    }
    const data = dto.password
      ? { ...dto, password: await bcrypt.hash(dto.password, 10) }
      : dto;
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.mapUserToResponseDto(updatedUser);
  }

  async deleteUser(id: number, requestingUserRole: Role) {
    if (requestingUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.enrollment.deleteMany({ where: { studentId: id } }); // Handle relations
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  private mapUserToResponseDto(user: User) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}