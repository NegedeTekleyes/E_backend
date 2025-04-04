import { Controller, Post,Get,BadRequestException,Query, Body, UseGuards, Request } from "@nestjs/common";
import { Request as ExpressRequest } from 'express';
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) { }
    
    @Post('register')
   async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
   }

    
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('verify')
    async verifyEmail(@Query('token') token: string) {
        if (!token) {
            throw new BadRequestException('Token is required');
        }
        return this.authService.verifyEmail(token);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getCurrentUser(@Request() req: ExpressRequest & { user: { sub: number; email: string; role: string } }) {
        return this.authService.getCurrentUser(req.user.sub);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req: ExpressRequest & { user: { sub: number } }) {
        return this.authService.logout(req.user.sub);
    }
}