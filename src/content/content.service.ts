import { ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";



export class ContentService {
    constructor(private prisma: PrismaService){}

    async getCourseVideos(courseId: number, userId: number) {
        // verify user is enrolled and enrollment is active
        const enrollment = await this.prisma.enrollment.findFirst({
            where:{courseId, studentId: userId, status: 'ACTIVE'},
        })
        if (!enrollment) {
            throw new ForbiddenException('You are not enrolled in this course or enrollment is not active');
        }
        return this.prisma.video.findMany({
            where: { courseId },
            orderBy: { id: 'asc' },
        })

    }

    async getCourseNotes(courseId: number, userId: number) {
        const enrollment = await this.prisma.enrollment.findFirst({
            where: {courseId, studentId: userId, status: 'ACTIVE'},
        })
        if (!enrollment) {
            throw new ForbiddenException('You are not enrolled in this course or enrollment is not active');
        }

        return this.prisma.note.findMany({
            where: { courseId },
            orderBy: { id: 'asc' },
        })
    }

    async submitQuiz(courseId: number, userId: number, quizId: number, answers: any) {
        const enrollment = await this.prisma.enrollment.findFirst({
            where: {courseId, studentId: userId, status: 'ACTIVE'},
        })
        if (!enrollment) {
            throw new ForbiddenException('You are not enrolled in this course or enrollment is not active');
        }
        const quiz = await this.prisma.quiz.findUnique({
            where: {id: quizId, courseId},
        })
        if (!quiz) {
            throw new ForbiddenException('Quiz not found or does not belong to this course');
        }
        
        // calculate score (simplified example)
        const score = this.calculateQuizScore(quiz.questions, answers)

        const submission = await this.prisma.quizSubmission.create({
            data: {
               studentId: userId,
                quizId,
                score,
                answers,
                submittedAt: new Date(),
            }
        })

        // update enrollment progress (example: +10% per quiz)
        const progressIncrement = 10; // adjust based on quiz weight
        await this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {progress: Math.min(enrollment.progress + progressIncrement, 100)},
        })
return submission;
    }

    private calculateQuizScore(questions: any, answers: any): number {
        let score = 0;
        for (const question of questions) {
            if (answers[question.id] === question.correctAnswer) {
                score += 10; // or whatever scoring logic you want
            }
        }
        return score;
    }

}