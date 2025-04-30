import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createPaymentDto } from './dto/create-payment.dto';


@Controller('payments')
    
@UseGuards(JwtAuthGuard)
export class PaymentController{
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    async createPayment(@Body() createPaymentDto: createPaymentDto, @Request() req: any) {
        return this.paymentService.createPayment(
            req.user.id,
            createPaymentDto.enrollmentId,
            createPaymentDto.amount,
            createPaymentDto.method,
        )
    }
       
    @Get('my-payments')
    async getMyPayments(@Request() req: any) {
        return this.paymentService.getUserPayments(req.user.id);

    }

    }
