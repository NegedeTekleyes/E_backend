import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Email or phone must be a string' })
  @IsNotEmpty({ message: 'Email or phone is required' })
  emailOrPhone: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}