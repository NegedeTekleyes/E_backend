
import {Module} from '@nestjs/common'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtAuthGuard} from './jwt-auth.guard'
import {JwtModule} from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { EmailService } from './email.service'
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [
        PrismaModule,
        ConfigModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET  || 'your-secret',
            signOptions: {expiresIn: '1h'},
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService,PrismaService, EmailService, JwtAuthGuard],
    exports: [JwtAuthGuard, JwtModule],
 
})
export class AuthModule{}