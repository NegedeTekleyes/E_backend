import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user.constants';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;
    
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    phone?: string;


    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    
}