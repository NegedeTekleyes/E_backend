import {IsEmail, MinLength,IsNotEmpty,IsEnum, IsOptional, Matches} from 'class-validator';
import {Role} from '@prisma/client';
export class RegisterDto {
    @IsEmail({}, {message: 'Invalid email format'})
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsEnum(Role, { message: 'Role must be STUDENT, INSTRUCTOR, or ADMIN' })
        @IsNotEmpty({ message: 'Role is required' })
    role: Role;

    @IsNotEmpty({ message: 'Name is required' })
    @IsOptional()
    name: string;

    @IsOptional()
    @Matches(/^\+251[79]\d{8}$/, {message:  'Phone must be a valid Ethiopian number (e.g +251941416514)'})
    phone?: string;

    
}