
import {Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtAuthGuard} from './jwt-auth.guard'
import {JwtModule} from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { EmailService } from './email.service'
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
    imports: [
        PrismaModule,
        ConfigModule,
        JwtModule.registerAsync({
            useFactory: (ConfigService: ConfigService) => ({
                secret: ConfigService.get<string>('JWT_SECRET'), // Use the secret from your environment variables
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [AuthController],
    providers: [AuthService,PrismaService, EmailService, JwtAuthGuard],
    exports: [JwtAuthGuard, JwtModule],
 
})
export class AuthModule{}