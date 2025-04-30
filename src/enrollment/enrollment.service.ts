import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../user/user.constants';

@Injectable()
export class EnrollmentService {
    constructor(private prisma: PrismaService) { }

    async createEnrollment(courseId: number, userId: number, userRole: UserRole) {
        if (userRole !== UserRole.STUDENT) {
            throw new ForbiddenException('Only students can enroll in courses');
        }

        // Check if course exists
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new BadRequestException('Course not found');
        }

        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const existingEnrollment = await this.prisma.enrollment.findFirst({
            where: {
                studentId: userId,
                courseId: courseId,
            },
        });
        if (existingEnrollment) {
            throw new BadRequestException('You are already enrolled in this course');
        }
        // create enrollment first
        const enrollment = await this.prisma.enrollment.create({
            data: {
                studentId: userId,
                courseId: courseId,
                progress: 0,
                status: 'PENDING',
                enrolledAt: new Date(),
            },
            include: {
                course: true,
            },
        });
        // send a confirmation message using  the created enrollment data
        await this.prisma.message.create({
            data: {
                senderId: 1,
                receiverId: userId,
                content: `You have successfully enrolled in ${enrollment.course.title}!`,
                sentAt: new Date(),
                isRead: false,
            },
        });
        // return the enrollment data
        return enrollment;
    }

    async getCourseEnrollments(courseId: number){
        return this.prisma.enrollment.findMany({
            where: {courseId},
            include: {
                student: {
                    select: {
                        id: true,
                        email:true,
                        name: true,
                    }
                }
            }
        })
    }

    async updateEnrollmentProgress(enrollmentId: number, progress: number, userId: number) {
        if (progress < 0 || progress > 100) {
            throw new BadRequestException('Progress must be between 0 and 100');
        }

        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            select: {
                id: true,
                studentId: true,
                courseId: true,
                progress: true,
                enrolledAt: true,
                completedAt: true,
                status: true,
            },
        });
        if (!enrollment) {
            throw new BadRequestException('Enrollment not found');
        }

        if (enrollment.studentId !== userId) {
            throw new ForbiddenException('You do not have permission to update this enrollment');
        }

        const updatedData: any = { progress };
        if (progress === 100) {
            updatedData.status = 'COMPLETED';
            updatedData.completedAt = new Date();
        } else if (enrollment.status ==='PENDING' && progress > 0) {
            updatedData.status = 'ACTIVE';
            // issue certificate
            await this.prisma.certificate.create({
                data: {
                    studentId: userId,
                    courseId: enrollment.courseId,
                    issuedAt: new Date(),
                    downloadUrl: `https://elearning.example.com/certificates/${enrollmentId}.pdf`
                }
            })
        }

        return this.prisma.enrollment.update({
            where: { id: enrollmentId },
            data: updatedData,
            include: { course: true },
        });
    }

    async getStudentEnrollments(userId: number) {
        return this.prisma.enrollment.findMany({
            where: { studentId: userId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                }
            },
        });
    }
}