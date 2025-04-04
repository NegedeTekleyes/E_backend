import { Controller, Post,Get,BadRequestException,Query, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
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
}