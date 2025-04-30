import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { UserRole } from '../user/user.constants';

@Controller('enrollment')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  create(
    @Body('courseId', ParseIntPipe) courseId: number,
    @Request() req: ExpressRequest & { user: { sub: number; role: UserRole } }, // Use enum type
  ) {
    return this.enrollmentService.createEnrollment(
      courseId,
      req.user.sub,
      req.user.role, // Correct type
    );
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body('progress', ParseIntPipe) progress: number,
    @Request() req: ExpressRequest & { user: { sub: number } }, // Extract user ID
  ) {
    return this.enrollmentService.updateEnrollmentProgress(
      id,
      progress,
      req.user.sub, // Pass user ID for authorization
    );
  }

  @Get('student')
  getStudentEnrollments(@Request() req: ExpressRequest & { user: { sub: number } }) {
    return this.enrollmentService.getStudentEnrollments(req.user.sub);
  }

  @Get('course/:courseId')
  getCourseEnrollments(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.getCourseEnrollments(courseId);
  }
}