import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../user.constants';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    phone?: string;
    
}