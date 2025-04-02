import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client'; // Use Prisma Role enum
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

@Controller('users')
@UseGuards(JwtAuthGuard) // Apply globally to all endpoints
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query('role') role: Role, @Request() req: ExpressRequest & { user: JwtPayload }) {
    return this.userService.getAllUsers(req.user.role, role); // Filter by role, check requesting role
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: ExpressRequest & { user: JwtPayload }) {
    return this.userService.getUserById(id, req.user.userId, req.user.role);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req: ExpressRequest & { user: JwtPayload }) {
    return this.userService.createUser(createUserDto, req.user.role);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: ExpressRequest & { user: JwtPayload },
  ) {
    return this.userService.updateUser(id, updateUserDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: Request & { user: JwtPayload }) {
    return this.userService.deleteUser(id, req.user.role);
  }
}