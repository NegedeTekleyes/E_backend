import { Module } from '@nestjs/common';
import { PaymentService} from './payment.service'
import { PaymentController} from './payment.controller'
import {PrismaService} from '../prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [AuthModule],
    controllers: [PaymentController],
    providers: [PaymentService, PrismaService],
})
export class PaymentsModule {}
