import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ContentService } from "./content.service";
import { CreateQuizSubmissionDto } from "./dto/create-quiz-submission.dto";
import { Request } from "@nestjs/common";

@Controller('courses/:courseId')
@UseGuards(JwtAuthGuard)
export class ContentController {
    constructor(private readonly contentService: ContentService) {}

    @Get('videos')
    async getVideos(@Param('courseId', ParseIntPipe) courseId: number, @Request() req: any) {
        return this.contentService.getCourseNotes(courseId, req.user.id);
    }

    @Post('quizzes/:quizId/submit')
    async submitQuiz(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('quizId', ParseIntPipe) quizId: number,
        @Body() createQuizSubmissionDto: CreateQuizSubmissionDto,
        @Request() req: any,
    )
    {
        return this.contentService.submitQuiz(courseId, quizId, req.user.id, createQuizSubmissionDto.answers)
    }
}