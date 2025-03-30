import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
    constructor(private prisma: PrismaService) {}

    async createEnrollment(courseId: number, userId: number) {
        return this.prisma.enrollment.create({
            data: {
                studentId: userId,
                courseId: courseId,
                progress: 0,
                enrolledAt: new Date(),
            },
        });
    }
}