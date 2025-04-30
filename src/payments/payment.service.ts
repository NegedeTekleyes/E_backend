import { BadRequestException , Injectable} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PaymentStatus } from "@prisma/client";


@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }
    
    async createPayment(userId: number, enrollmentId: number, amount: number, method: string) {
        

        // validate enrollment exists and is PENDING
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                id: enrollmentId
            },
        })  
        if (!enrollment) {
            throw new BadRequestException('Enrollment not found')
        }

        //create payment

        const payment = await this.prisma.payment.create({
            data: {
                userId,
                enrollmentId,
                amount,
                method,
                transactionId: `TXN-${Date.now()}`, 
                status: PaymentStatus.PENDING,
                createdAt: new Date(),
            }
        })

        //  simulate payment processing (integrate with a gateway like chapa or stripe)
        const isPaymentSuccessful = true; 
        if (isPaymentSuccessful) {
            await this.prisma.payment.update({
                where: { id: enrollmentId },
                data: {status: 'COMPLETED'},

            })
        } else {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: PaymentStatus.FAILED},
            })
        }
        return payment;
            
        
    }

    async getUserPayments(userId: number) {
        return this.prisma.payment.findMany({
            where: { userId },
            include: { enrollment: { include: {course: true}}},
        })
    }
}