import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from './user.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    
    async createUser(dto: CreateUserDto, requestingUserRole: UserRole) {
        if (requestingUserRole !==UserRole.ADMIN) {
            throw new ForbiddenException('Only admins can create users')
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role,
                name: dto.name,
                phone: dto.phone
            }   
        });
        return this.mapUserToResponseDto(user);

    }

    async getUserById(id: number, requestingUserRole: UserRole) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (requestingUserRole !== UserRole.ADMIN && user.role === UserRole.ADMIN) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }
        return this.mapUserToResponseDto(user);
    }

    async getAllUsers(requestingUserRole: UserRole) {

        if (!Object.values(UserRole).includes(requestingUserRole)) {
            throw new ForbiddenException('Invalid user role');

        } 
        if (requestingUserRole !== UserRole.ADMIN) {
            throw new ForbiddenException('Only admins can view all users');
        }

        const users = await this.prisma.user.findMany()
         return users.map(this.mapUserToResponseDto);
    }
    
    async updateUser(id: number, dto: UpdateUserDto, requestingUserRole: UserRole) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (requestingUserRole !== UserRole.ADMIN && user.id !== id) {
            throw new ForbiddenException('Cannot update other users');
        }
        const updateData = { ...dto };
        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        return this.mapUserToResponseDto(updatedUser);

    }

    async deleteUser(id: number, requestingUserRole: UserRole) {
        if (requestingUserRole !== UserRole.ADMIN) {
            throw new ForbiddenException('Only admins can delete users');
        }
        // const user = await this.prisma.user.findUnique({
        //     where: {
        //         id
        //     }
        // });
        // if (!user) {
        //     throw new NotFoundException('User not found');
        // }
        await this.prisma.user.delete({
            where: {
                id
            }
        });
        return {message: 'User deleted successfully'};
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
        }
    }
}