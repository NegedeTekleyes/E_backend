import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request,UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {Request as ExpressRequest} from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './user.constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';



@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    @Get()
    findAll(@Request() req: ExpressRequest & { user: { role: string}}) {
        return this.userService.getAllUsers(req.user.role as  UserRole);   //pass role only
    }

@Get(':id')  //GET/users/:id
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.userService.getUserById(id, req.user.role); //pass requesting user role
    }
    

    @Post()
    create(@Body() createUserDto: CreateUserDto, @Request() req) {
        return this.userService.createUser(createUserDto, req.user.role); //pass requesting user role
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req,
    ) {
        return this.userService.updateUser(id, updateUserDto, req.user.role); //pass requesting user role
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ) {
        return this.userService.deleteUser(id, req.user.role); //pass requesting user role
    }
    
}